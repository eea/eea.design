from Products.CMFCore.utils import getToolByName
from Products.CMFEditions.utilities import maybeSaveVersion
import logging

logger = logging.getLogger('eea.design.migration')


def update_design_elements(context):
    """ Modified design elements html #117294
    """
    count = 0
    cat = context.portal_catalog
    match = 'bg-'
    ptype = ['Fiche', 'Highlight', 'Article']
    brains = cat(portal_type=ptype, show_inactive=True)
    pat = [("bg-green", "box-tertiary"),
        ("bg-blue", "box-primary"),
        ('class="bg-grey"', 'class="pullquote-container"'),
        ('="fullwidth-bg bg-grey', '="fullwidth-bg eea-block bg-secondary'),
        ('box fullwidth-bg bg-grey',
         '="fullwidth-bg eea-block bg-secondary'),
        ('box fullwidth-bg bg-blue', '="fullwidth-bg eea-block bg-primary'),
        ('box fullwidth-bg bg-green',
         '="fullwidth-bg eea-block bg-tertiary'),
        (' bg-grey', ' box-secondary')
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
                obj.reindexObject(idxs=['text'])
            except Exception:
                logger.error("%s --> couldn't be reindexed", url)
                logger.info('Fixed %s', url)
            count += 1

    logger.info("Finished migration of eea.design #117294")
    print '%d %s were modified' % (count, ptype)
    return modified
