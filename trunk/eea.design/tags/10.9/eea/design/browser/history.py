""" Speedup history viewlet
"""
from Acquisition import aq_inner
from Products.CMFEditions.Permissions import AccessPreviousVersions
from Products.CMFPlone import PloneMessageFactory as _
from Products.CMFCore.utils import _checkPermission
from Products.CMFCore.utils import getToolByName
from plone.app.layout.viewlets.content import ContentHistoryView

class HistoryView(ContentHistoryView):
    """ Patch ContentHistoryView in order to speed it up
    """
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
