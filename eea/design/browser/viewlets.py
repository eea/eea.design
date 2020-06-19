""" Custom viewlets
"""
import os
from cgi import escape
from datetime import datetime
from distutils.version import LooseVersion
from Acquisition import aq_parent, aq_base, aq_inner
from Products.CMFCore.utils import _checkPermission
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.utils import safe_unicode
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from eea.cache import cache
from eea.versions.interfaces import IGetVersions
from eea.versions.controlpanel.utils import get_version_prefix
from eea.design.browser.interfaces import ISubFoldersListing
from plone.app.layout.links import viewlets as links
from plone.app.layout.viewlets import common, content
from plone.app.layout.viewlets.content import DocumentBylineViewlet as \
    BaseBelowContentTitleViewlet
from plone.memoize.instance import memoize
from zope.component.hooks import getSite
from zope.annotation.interfaces import IAnnotations
from zope.component import getMultiAdapter, queryAdapter


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
    """ A custom version of the document-actions viewlet
    """
    render = ViewPageTemplateFile('templates/document_actions.pt')


class SocialMediaViewlet(content.DocumentActionsViewlet):
    """ A footer viewlet to contain social media icons
    """
    render = ViewPageTemplateFile('templates/socialmedia.pt')


class DocumentBylineViewlet(content.DocumentBylineViewlet):
    """ A custom version of the document-byline viewlet
    """
    render = ViewPageTemplateFile('templates/document_byline.pt')

    def author(self, name=None):
        """ Override author to also be able to get author by given name
        """
        if not name:
            name = self.creator()
        membership = getToolByName(self.context, 'portal_membership')
        return membership.getMemberInfo(name)

    def authorname(self, name=None):
        """ Override authorname to also be able to get authorname by given name
        """
        if not name:
            name = self.creator()
        author = self.author(name)
        return author['fullname'] if author else name

    def creators(self, skipCreator=True):
        """ Return all the other authors if skipCreator is True
        """
        creator = self.creator()
        creators = self.context.listCreators()

        authors = []
        for author in creators:
            if skipCreator and author == creator:
                continue
            authors.append(author)
        return authors

    @property
    def prefs_properties(self):
        """ Return portal properties
        """
        properties = getToolByName(self.context, 'portal_properties')
        return getattr(properties, 'site_properties')

    def showPubDate(self):
        """ Return True if context portal types it set to show publication date
        """
        context = aq_inner(self.context)
        portal_type = getattr(context, 'portal_type', None)
        return portal_type in self.prefs_properties.metatypes_showpubdate

    def showModDate(self):
        """ Return True if context portal types it set to show modification
            date
        """
        context = aq_inner(self.context)
        portal_type = getattr(context, 'portal_type', None)
        return portal_type in self.prefs_properties.metatypes_showmoddate

    def showCreDate(self):
        """ Return True if context portal types it set to show creation date
        """
        context = aq_inner(self.context)
        portal_type = getattr(context, 'portal_type', None)
        return portal_type in self.prefs_properties.metatypes_showcredate

    def labelBlacklist(self):
        """ Return True if context portal types it set to label blaklist
        """
        context = aq_inner(self.context)
        portal_type = getattr(context, 'portal_type', None)
        return portal_type in \
            self.prefs_properties.metatypes_labeling_blacklist

    def showRights(self):
        """ Return True if context portal types it set to show rights
        """
        context = aq_inner(self.context)
        portal_type = getattr(context, 'portal_type', None)
        return portal_type in self.prefs_properties.allowed_types_rights

    def version_id(self):
        """ get version id of context
        """
        try:
            return IGetVersions(self.context).versionId
        except TypeError:
            return None

    def get_version_object(self, version):
        """ Retrieve portal_version object if found
        """
        vtool = self.context.portal_eea_versions
        res = vtool.get(version.split('-')[0])
        if not res:
            return get_version_prefix(self.context)
        return res

    def time_estimate(self):
        """ time_estimation for reading time """
        anno = IAnnotations(self.context)
        scores = anno.get('readability_scores')
        if not scores:
            return ""
        words = 0
        for value in scores.values():
            if not value.get('readability_value'):
                continue
            words += int(value.get('word_count', 0))
        minutes = int(round(words / 228.0))
        if not minutes and words > 1:
            minutes = 1
        return minutes

    def available(self):
        """ Available
        """
        version_id = self.version_id()
        if not version_id:
            return ''
        if '-' not in version_id:
            return ''
        version_obj = self.get_version_object(version_id)
        return version_obj.show_version_id if version_obj else ''


class PathBarViewlet(common.PathBarViewlet):
    """A modified breadcrumbs viewlet
    """
    index = ViewPageTemplateFile('templates/path_bar.pt')


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
        self.manageUrl = '%s/@@manage-portlets-footer' % \
                         context_state.view_url()

        # This is the way it's done in plone.app.portlets.manager
        mt = getToolByName(self.context, 'portal_membership')
        self.canManagePortlets = mt.checkPermission(
            'Portlets: Manage portlets', self.context)


class ColophonViewlet(common.ViewletBase):
    """ Footer colophon
    """
    @property
    def versions(self):
        """ Get versions
        """
        anno = queryAdapter(getSite(), IAnnotations)
        versions = anno.get("EEA_KGS_VERSION", {})
        for version in sorted(versions, key=LooseVersion, reverse=1):
            yield version, versions[version]

    @cache(lambda *args: "uptime", lifetime=86400)
    def uptime(self):
        """ Plone up-time
        """
        for version, uptime in self.versions:
            return uptime.strftime("%d %B %Y %H:%M")
        return datetime.now().strftime("%d %B %Y %H:%M")

    @cache(lambda *args: "version", lifetime=86400)
    def version(self):
        """ Get KGS version
        """
        for version, uptime in self.versions:
            return version
        return os.environ.get("EEA_KGS_VERSION", "")

    @cache(lambda *args: "previous", lifetime=86400)
    def previous(self):
        """ Get previous KGS version
        """
        for version, uptime in self.versions:
            if version == self.version():
                continue
            return version
        return ""

    @cache(lambda *args: "release", lifetime=86400)
    def release(self):
        """ Release URL
        """
        return "https://github.com/eea/eea.docker.kgs/releases"

    def external(self):
        """ External service template
        """
        return "getFooter" in getattr(self.request, 'URL', "")

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
                return False if portlets is not True else True
        return False

    @memoize
    def subfolders_listing(self):
        """ Return all subfolders from parent if context isn't folder
        """
        base_obj = aq_base(self.context)
        if hasattr(base_obj, 'queryCatalog') or base_obj.meta_type \
                != "ATFolder":
            parent = aq_parent(self.context)
            res = parent.getFolderContents({'portal_type': "Folder"})
            res = [obj for obj in res if obj.exclude_from_nav is not True]
            return res
        res = self.context.getFolderContents({'portal_type': "Folder"})
        res = [obj for obj in res if obj.exclude_from_nav is not True]
        return res


class QRBox(common.ViewletBase):
    """ Custom viewlet for qr box
    """
    render = ViewPageTemplateFile('templates/qrbox.viewlet.pt')

    @property
    def available(self):
        """ Available
        """
        return True


class MiniThemeTagsViewlet(common.ViewletBase):
    """ Custom viewlet for mini mini theme tags
    """
    render = ViewPageTemplateFile('templates/mini_theme_tags_viewlet.pt')

    # @property
    # def available(self):
    #     """ Available
    #     """
    #     return True


class ExportActionsViewlet(common.ViewletBase):
    """ Custom viewlet for exporting actions
    """
    render = ViewPageTemplateFile('templates/export_actions.pt')

    def update(self):
        """ update
        """
        super(ExportActionsViewlet, self).update()

        self.context_state = getMultiAdapter((self.context, self.request),
                                             name=u'plone_context_state')
        self.actions = self.context_state.actions('export_actions')


class GlobalSectionsViewlet(common.GlobalSectionsViewlet):
    """ Override sections viewlet
    """
    render = ViewPageTemplateFile('templates/sections.pt')

    def update(self):
        """ update method
        """
        super(GlobalSectionsViewlet, self).update()
        self.selected_tabs = self.selectedTabs(portal_tabs=self.portal_tabs)
        self.selected_portal_tab = self.selected_tabs['portal']

    def selectedTabs(self, default_tab='index_html', portal_tabs=()):
        """ selected tabs method
        """
        plone_url = getToolByName(self.context, 'portal_url')()
        plone_url_len = len(plone_url)
        request = self.request
        valid_actions = []

        url = request['URL']
        path = url[plone_url_len:]

        # remove /SITE/ in development
        if path.startswith('/SITE/'):
            path = path[5:]

        for action in portal_tabs:
            action_url = action['url']
            if action_url.startswith('/'):
                action_url = plone_url + action['url']
            if action_url.endswith('/'):
                action_url = action_url[:-1]

            if not action_url.startswith(plone_url):
                # In this case the action url is an external link. Then, we
                # avoid issues (bad portal_tab selection) continuing with next
                # action.
                continue

            action_path = action_url[plone_url_len:]
            if not action_path.startswith('/'):
                action_path = '/' + action_path
            if path.startswith(action_path + '/') or path == action_path:
                # Make a list of the action ids, along with the path length
                # for choosing the longest (most relevant) path.
                valid_actions.append((len(action_path), action['id']))

        # Sort by path length, the longest matching path wins
        valid_actions.sort()
        if valid_actions:
            return {'portal': valid_actions[-1][1]}
        return {'portal': default_tab}
