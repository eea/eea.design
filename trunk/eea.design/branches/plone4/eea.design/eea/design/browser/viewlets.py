from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.app.layout.viewlets import common, content
from zope.component import getMultiAdapter
from Products.CMFCore.utils import getToolByName

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


class FooterPortletsViewlet(common.ViewletBase):
    render = ViewPageTemplateFile('templates/footer.pt')

    def update(self):
        """
        Define everything we want to call in the template
        """
        context_state = getMultiAdapter((self.context, self.request), name=u'plone_context_state')
        self.manageUrl =  '%s/@@manage-portlets-footer' % context_state.view_url()

        ## This is the way it's done in plone.app.portlets.manager, so we'll do the same
        mt = getToolByName(self.context, 'portal_membership')
        self.canManagePortlets = mt.checkPermission('Portlets: Manage portlets', self.context)
