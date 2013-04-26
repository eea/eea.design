""" Custom viewlets
"""
from Products.CMFCore.utils import _checkPermission
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.utils import safe_unicode
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from cgi import escape
from plone.app.layout.links import viewlets as links
from plone.app.layout.viewlets import common, content
from plone.app.layout.viewlets.content import DocumentBylineViewlet as \
    BaseBelowContentTitleViewlet
from zope.component import getMultiAdapter
from eea.design.browser.interfaces import ISubFoldersListing
from Acquisition import aq_parent, aq_base

class LogoViewlet(common.LogoViewlet):
    """A custom version of the logo viewlet
    """
    render = ViewPageTemplateFile('templates/logo.pt')

class TitleViewlet(common.TitleViewlet):
    """A custom version of the title viewlet
    """
    index = ViewPageTemplateFile('templates/title.pt')
    def update(self):
        """ Update
        """
        portal_state = getMultiAdapter((self.context, self.request),
                                        name=u'plone_portal_state')
        context_state = getMultiAdapter((self.context, self.request),
                                         name=u'plone_context_state')
        if not hasattr(self, 'page_title'):
            self.page_title = escape(safe_unicode(context_state.object_title(
            )))
        portal_title = escape(safe_unicode(portal_state.portal_title()))
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

class LanguageSelectorViewlet(common.ViewletBase):
    """ A custom viewlet registered below the title for language selection
    """
    render = ViewPageTemplateFile('templates/language_selector.pt')


class BelowEditContentTitleViewlet(BaseBelowContentTitleViewlet):
    """Customized this viewlet because it won't show history
    """

    def show_history(self):
        """ History
        """
        if not _checkPermission('CMFEditions: Access previous versions',
                                self.context):
            return False
        return True
    
    
class JSBelowBodyViewlet(common.ViewletBase):
    """ A custom viewlet registered below the body tag specifically for js
    that needs to be just below the body tag.
    """
    render = ViewPageTemplateFile('templates/inline_js_belowbodytag.pt')


from plone.memoize.instance import memoize

class SubFoldersViewlet(common.ViewletBase):
    """ A custom viewlet registered above the body tag to insert a listing of
    subfolders for pages that don't have the navigation portlet
    """
    render = ViewPageTemplateFile('templates/subfolders_listing.pt')

    @property
    def available(self):
        """ Condition for rendering of this viewlets
            Will be enabled also if parent has ISubFoldersListing and context
            doesn't have right column
        """
        if ISubFoldersListing.providedBy(self.context):
            return True
        else:
            parent = aq_parent(self.context)
            if ISubFoldersListing.providedBy(parent):
                plone_view = self.context.restrictedTraverse('@@plone')
                portlets = plone_view.have_portlets('plone.rightcolumn')
                return False if portlets == True else True
        return False

    @memoize
    def subfolders_listing(self):
        """ Return all subfolders from parent if context isn't folder
        """
        base_obj = aq_base(self.context)
        if hasattr(base_obj, 'queryCatalog') or base_obj.meta_type \
                                                                != "ATFolder":
            parent = aq_parent(self.context)
            res = parent.getFolderContents({'portal_type' :"Folder"})
            res = [obj for obj in res if obj.exclude_from_nav != True]
            return res 
        else:
            res = self.context.getFolderContents({'portal_type' :"Folder"})
            res = [obj for obj in res if obj.exclude_from_nav != True]
            return res 
