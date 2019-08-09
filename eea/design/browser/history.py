""" Speedup history viewlet
"""
from Acquisition import aq_inner
from Products.CMFEditions.Permissions import AccessPreviousVersions
from Products.CMFPlone import PloneMessageFactory as _
from Products.CMFCore.utils import _checkPermission
from Products.CMFCore.utils import getToolByName
from plone.app.layout.viewlets.content import ContentHistoryView
from eea.cache import cache as ramcache

class HistoryView(ContentHistoryView):
    """ Patch ContentHistoryView in order to speed it up
    """
    @ramcache(lambda method, self, userid: userid)
    def getUserInfo(self, userid):
        actor = dict(fullname=userid)
        mt = getToolByName(self.context, 'portal_membership')
        info = mt.getMemberInfo(userid)
        if info is None:
            return dict(actor_home="", actor=actor)

        fullname = info.get("fullname", None)
        if fullname:
            actor["fullname"] = fullname

        return dict(actor=actor,
                    actor_home="%s/author/%s" % (self.site_url, userid))

    def workflowHistory(self, complete=True):
        """Return workflow history of this context.

        Taken from plone_scripts/getWorkflowHistory.py
        """
        context = aq_inner(self.context)
        # check if the current user has the proper permissions
        if not (_checkPermission('Request review', context) or
            _checkPermission('Review portal content', context)):
            return []

        workflow = getToolByName(context, 'portal_workflow')
        membership = getToolByName(context, 'portal_membership')

        review_history = []

        try:
            # get total history
            review_history = workflow.getInfoFor(context, 'review_history')

            if not complete:
                # filter out automatic transitions.
                review_history = [r for r in review_history if r['action']]
            else:
                review_history = list(review_history)

            portal_type = context.portal_type
            anon = _(u'label_anonymous_user', default=u'Anonymous User')

            for r in review_history:
                r['type'] = 'workflow'
                r['transition_title'] = workflow.getTitleForTransitionOnType(
                    r['action'], portal_type) or _("Create")
                r['state_title'] = workflow.getTitleForStateOnType(
                    r['review_state'], portal_type)
                actorid = r['actor']
                r['actorid'] = actorid
                if actorid is None:
                    # action performed by an anonymous user
                    r['actor'] = {'username': anon, 'fullname': anon}
                    r['actor_home'] = ''
                else:
                    r['actor'] = membership.getMemberInfo(actorid)
                    if r['actor'] is not None:
                        r['actor_home'] = self.navigation_root_url + '/author/' + actorid
                    else:
                        # member info is not available
                        # the user was probably deleted
                        r['actor_home'] = ''
            review_history.reverse()

        except WorkflowException:
            log('plone.app.layout.viewlets.content: '
                '%s has no associated workflow' % context.absolute_url(),
                severity=logging.DEBUG)

        return review_history

    def revisionHistory(self):
        """ Patched revision history
        """
        context = aq_inner(self.context)
        if not _checkPermission(AccessPreviousVersions, context):
            return []

        rt = getToolByName(context, "portal_repository", None)
        if rt is None or not rt.isVersionable(context):
            return []

        context_url = context.absolute_url()
        history = rt.getHistoryMetadata(context)
        portal_diff = getToolByName(context, "portal_diff", None)
        can_diff = portal_diff is not None \
            and len(portal_diff.getDiffForPortalType(context.portal_type)) > 0
        can_revert = _checkPermission(
            'CMFEditions: Revert to previous versions', context)

        def morphVersionDataToHistoryFormat(vdata, version_id):
            """ Map version to history format
            """
            meta = vdata["metadata"]["sys_metadata"]
            userid = meta["principal"]
            info = dict(
                type='versioning',
                action=_(u"Edited"),
                transition_title=_(u"Edited"),
                actorid=userid,
                time=meta["timestamp"],
                comments=meta['comment'],
                version_id=version_id,
                preview_url=(
                    "%s/versions_history_form?version_id=%s#version_preview" %
                    (context_url, version_id)
                )
            )

            if can_diff:
                if version_id > 0:
                    info["diff_previous_url"] = ("%s/@@history?one=%s&two=%s" %
                            (context_url, version_id, version_id-1))

                info["diff_current_url"] = ("%s/@@history?one=current&two=%s" %
                                            (context_url, version_id))

            if can_revert:
                info["revert_url"] = "%s/revertversion" % context_url
            else:
                info["revert_url"] = None

            info.update(self.getUserInfo(userid))
            return info

        # History may be an empty list
        if not history:
            return history

        version_history = []
        retrieve = history.retrieve
        getId = history.getVersionId
        # Count backwards from most recent to least recent
        for i in xrange(history.getLength(countPurged=False)-1, -1, -1):
            version_history.append(
                morphVersionDataToHistoryFormat(retrieve(i, countPurged=False),
                                                getId(i, countPurged=False)))

        return version_history
