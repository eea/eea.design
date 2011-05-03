from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.app.layout.viewlets import common, content
from plone.app.layout.links import viewlets as links
from zope.component import getMultiAdapter
from Products.CMFCore.utils import getToolByName
from cgi import escape
from Products.CMFPlone.utils import safe_unicode

class SiteActionsViewlet(common.SiteActionsViewlet):
    """A custom version of the site-actions viewlet
    """
    render = ViewPageTemplateFile('templates/site_actions.pt')

class LogoViewlet(common.LogoViewlet):
    """A custom version of the logo viewlet
    """
    render = ViewPageTemplateFile('templates/logo.pt')

class GlobalSectionsCMSViewlet(common.GlobalSectionsViewlet):
    """A custom version of the global-sections class
    """
    render = ViewPageTemplateFile('templates/sections_cms.pt')

class TitleViewlet(common.TitleViewlet):
    """A custom version of the title viewlet
    """
    index = ViewPageTemplateFile('templates/title.pt')
    def update(self):
        portal_state = getMultiAdapter((self.context, self.request),
                                        name=u'plone_portal_state')
        context_state = getMultiAdapter((self.context, self.request),
                                         name=u'plone_context_state')
        page_title = escape(safe_unicode(context_state.object_title()))
        portal_title = escape(safe_unicode(portal_state.portal_title()))
        self.page_title = page_title
        self.portal_title = portal_title


class DocumentActionsViewlet(content.DocumentActionsViewlet):
    """A custom version of the document-actions viewlet
    """
    render = ViewPageTemplateFile('templates/document_actions.pt')


class DocumentBylineViewlet(content.DocumentBylineViewlet):
    """A custom version of the document-byline viewlet
    """
    render = ViewPageTemplateFile('templates/document_byline.pt')

class FooterPortletsViewlet(common.ViewletBase):
    """A modified footer viewlet to contain portlet information
    """
    render = ViewPageTemplateFile('templates/footer.pt')

    def update(self):
        """
        Define everything we want to call in the template
        """
        context_state = getMultiAdapter((self.context, self.request),
                                        name=u'plone_context_state')
        self.manageUrl =  '%s/@@manage-portlets-footer' % \
                                        context_state.view_url()

        # This is the way it's done in plone.app.portlets.manager
        mt = getToolByName(self.context, 'portal_membership')
        self.canManagePortlets = mt.checkPermission('Portlets: Manage portlets',
                                                    self.context)


class SearchViewlet(links.SearchViewlet):
    """A custom version of the links-search viewlet
    """
    _template = ViewPageTemplateFile('templates/links_search.pt')

class NavigationViewlet(links.NavigationViewlet):
    """A custom version of the links-navigation viewlet
    """
    _template = ViewPageTemplateFile('templates/links_navigation.pt')