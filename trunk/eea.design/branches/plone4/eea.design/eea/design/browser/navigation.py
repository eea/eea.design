from plone.app.portlets.portlets.navigation import Renderer

from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

class EEANavRenderer(Renderer):
    """Modification of the Navigation templates"""
    _template = ViewPageTemplateFile('templates/navigation.pt')
    recurse = ViewPageTemplateFile('templates/navigation_recurse.pt')