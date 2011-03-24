from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.app.layout.viewlets import common

class SiteActionViewlet(common.SiteActionsViewlet):
    """A custom version of the path bar class
    """
    render = ViewPageTemplateFile('templates/site_actions.pt')
