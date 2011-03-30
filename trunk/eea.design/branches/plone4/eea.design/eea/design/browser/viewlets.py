from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.app.layout.viewlets import common, content

class SiteActionViewlet(common.SiteActionsViewlet):
    """A custom version of the site-actions class
    """
    render = ViewPageTemplateFile('templates/site_actions.pt')

class LogoViewlet(common.LogoViewlet):
    """A custom version of the site-actions class
    """
    render = ViewPageTemplateFile('templates/logo.pt')

class GlobalSectionsViewlet(common.GlobalSectionsViewlet):
    """A custom version of the global-sections class
    """
    render = ViewPageTemplateFile('templates/sections.pt')

class DocumentActionsViewlet(content.DocumentActionsViewlet):
    """A custom version of the document-actions class
    """
    render = ViewPageTemplateFile('templates/document_actions.pt')
