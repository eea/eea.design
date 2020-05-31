""" Migrate view """
from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from Products.CMFEditions.utilities import maybeSaveVersion
from pprint import pprint
import logging

logger = logging.getLogger('eea.design.migration')


class MigrateDesignElements(BrowserView):
    """ Modified design elements html #117294
    """

    def __init__(self, context, request):
        """ init
        """
        super(MigrateDesignElements, self).__init__(context, request)
        self.context = context
        self.request = request

    def __call__(self):
        count = 0
        context = self.context
        cat = context.portal_catalog
        match = 'bg-'
        ptype = ['Fiche', 'Highlight', 'Article']
        brains = cat(portal_type=ptype, show_inactive=True)
        pat = [('class="bg-grey"', 'class="pullquote-container"'),
               ('box fullwidth-bg bg-blue',
                   'fullwidth-bg eea-block bg-primary'),
               ('box fullwidth-bg bg-grey',
                'fullwidth-bg eea-block bg-secondary'),
               ('box fullwidth-bg bg-green',
                'fullwidth-bg eea-block bg-tertiary'),
               ('="fullwidth-bg bg-grey',
                '="fullwidth-bg eea-block bg-secondary'),
               ("bg-blue", "box-primary"),
               ('bg-grey', ' box-secondary'),
               ("bg-green", "box-tertiary")
               ]
        modified = []

        mt = getToolByName(context, 'portal_membership', None)
        rt = getToolByName(context, "portal_repository", None)
        wf = getToolByName(context, "portal_workflow", None)
        actor = mt.getAuthenticatedMember().id

        for brain in brains:
            obj = brain.getObject()
            text = obj.getText()
            if match in text:
                review_state = wf.getInfoFor(obj, 'review_state', 'None')
                url = brain.getURL()
                modified.append(url)
                print url
                for pattern in pat:
                    text = text.replace(pattern[0], pattern[1])
                obj.setText(text, mimetype='text/html')
                if obj.portal_type == 'Fiche':
                    text = obj.getEndnotes()
                    if match in text:
                        for pattern in pat:
                            text = text.replace(pattern[0], pattern[1])
                        obj.setEndnotes(text, mimetype='text/html')

                comment = "Modified design elements html #117294"
                if not rt.isVersionable(obj):
                    history = obj.workflow_history  # persistent mapping
                    for name, wf_entries in history.items():
                        wf_entries = list(wf_entries)
                        wf_entries.append({'action': 'Edited',
                                           'review_state': review_state,
                                           'comments': comment,
                                           'actor': actor,
                                           'time': DateTime()})
                        history[name] = tuple(wf_entries)
                else:
                    maybeSaveVersion(obj, comment=comment, force=False)
                try:
                    obj.reindexObject()
                except Exception:
                    logger.error("%s --> couldn't be reindexed", url)
                count += 1

        logger.info("Finished migration of eea.design #117294")
        print '%d objects were modified' % count
        modified.sort()
        pprint(modified)
        logger.info("%s", '\n'.join(modified))
        return '\n'.join(modified)


class FindOldDesignElements(BrowserView):
    """ Find old design elements html #117294
    """

    def __init__(self, context, request):
        """ init
        """
        super(FindOldDesignElements, self).__init__(context, request)
        self.context = context
        self.request = request

    def __call__(self):
        cat = self.context.portal_catalog
        form = self.request.form
        match = form.get('text', 'bg-grey')
        form_field = form.get('field', 'text')
        ptype = form.get('ptype', 'Fiche')
        brains = cat(portal_type=ptype, show_inactive=True)
        modified = []
        for brain in brains:
            obj = brain.getObject()
            field = obj.getField(form_field)
            text = field.get(obj) or ''
            if match in text:
                modified.append(obj.absolute_url())
        modified.sort()
        modified.append('DONE')
        pprint(modified)
        return '\n'.join(modified)
