from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.app.layout.viewlets import common

class SiteActionViewlet(common.SiteActionsViewlet):
    """A custom version of the site-actions class
    """
    render = ViewPageTemplateFile('templates/site_actions.pt')

class LogoViewlet(common.LogoViewlet):
    """A custom version of the site-actions class
    """
    render = ViewPageTemplateFile('templates/logo.pt')
