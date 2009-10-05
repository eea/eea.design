from Products.CMFCore.utils import getToolByName


def migrate_from_eeadesign2006(context):
    portal =  context.getSite()
    css =  portal.portal_css
    css.manage_removeStylesheet('eea-highlights.css')
