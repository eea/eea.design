from Products.CMFCore.utils import getToolByName


def migrate_from_eeadesign2006(context):
    # only run this step if we are in eea.design profile
    if context.readDataFile('eea.design_various.txt') is None:
        return

    portal =  context.getSite()
    css =  portal.portal_css
    css.manage_removeStylesheet('eea-highlights.css')
    css.manage_removeStylesheet('portlet.css')

    # remove old actions since we can't do it with GenericSetup
    atool = getToolByName(portal, 'portal_actions')
    actions =[ a.id for a in  atool.listActions()]
    actionPos = []
    for a in ['glossary', 'sitemap','faq']:
        if a in actions:
            actionPos.append(actions.index(a))
    if actionPos:
        portal.portal_actions.deleteActions(actionPos)
