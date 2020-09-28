""" Controllers
"""
from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone import utils as putils
from Acquisition import aq_base, aq_inner, aq_parent
from plone.memoize.view import memoize
from plone.registry.interfaces import IRegistry
from zope.component import getUtility



class Main(BrowserView):
    """ Main View
    """
    def _getRoot(self):
        """ Return the root of our application. """
        if not putils.base_hasattr(self, '_root'):
            portal_url = getToolByName(self.context, 'portal_url')
            portal = portal_url.getPortalObject()
            obj = self.context
            while aq_base(obj) is not aq_base(portal):
                obj = aq_parent(aq_inner(obj))
            self._root = [obj]
        return self._root[0]

    def inApplication(self):
        """ Application?
        """
        root = self._getRoot()
        portal_url = getToolByName(self.context, 'portal_url')
        portal = portal_url.getPortalObject()
        return root != aq_base(portal)


class FullWidthContentTypes(BrowserView):
    """ Fullwidth body class content-types
    """

    def __init__(self, context, request):
        """ init
        """
        super(FullWidthContentTypes, self).__init__(context, request)
        self.context = context
        self.request = request

    def __call__(self):
        """ boolean if fullwidth class should be enabled for given content-type
        """
        fullwidth_ctypes = self.get_full_registry() or []
        return self.context.portal_type in fullwidth_ctypes

    @memoize
    def get_full_registry(self):
        """ content registry cache
        """
        registry = getUtility(IRegistry)
        return registry.get('Products.EEAContentTypes.browser.interfaces.'
                            'IEEAContentTypesSettings.fullwidthFor')


class MiniHeaderContentTypes(BrowserView):
    """ Mini Header body class content-types
    """

    def __init__(self, context, request):
        """ init
        """
        super(MiniHeaderContentTypes, self).__init__(context, request)
        self.context = context
        self.request = request

    def __call__(self):
        """ boolean if miniheader class should be enabled for given content-type
        """
        mini_header_ctypes = self.get_mini_registry() or []

        mini_header_disabled_in_template = self.request.get(
            'disable_eea.miniheader')
        return self.context.portal_type in mini_header_ctypes and \
               not mini_header_disabled_in_template

    @memoize
    def get_mini_registry(self):
        """ content registry cache
        """
        registry = self.context.portal_properties.site_properties
        data = registry.getProperty('mini_header_for', None)
        return data

    @memoize
    def get_light_header_image(self):
        """ return header image path
        """
        image_field = self.context.getField('image')
        if image_field:
            image_size = image_field.getSize(self.context)
            if image_size[0] != 0:
                return self.context.absolute_url()
        portal_url = getToolByName(self.context, 'portal_url')
        portal = portal_url.getPortalObject()
        tool = getToolByName(portal, 'portal_depiction')
        type_to_check = getattr(self.context, 'Type', lambda: "")().lower() + \
                        '-header'

        img = tool.get(type_to_check) or tool.get('generic-header')
        return img.absolute_url()

    @memoize
    def show_right_column(self):
        """ content registry cache
        """
        registry = self.context.portal_properties.site_properties
        ptypes = registry.getProperty('mini_header_right_column_for', [])
        return self.context.portal_type in ptypes

    @memoize
    def show_light_header(self):
        """ content registry cache
        """
        registry = self.context.portal_properties.site_properties
        ptypes = registry.getProperty('mini_header_light_for', [])
        return self.context.portal_type in ptypes

    @memoize
    def show_mini_type(self):
        """ content registry cache
        """
        registry = self.context.portal_properties.site_properties
        ptypes = registry.getProperty('mini_header_type_for', [])
        return self.context.portal_type in ptypes


class ScrollAnalyticsContentTypes(BrowserView):
    """ scrollAnalytics body class content-types
    """

    def __init__(self, context, request):
        """ init
        """
        super(ScrollAnalyticsContentTypes, self).__init__(context, request)
        self.context = context
        self.request = request

    def __call__(self):
        """ boolean if scrollAnalytics class should be enabled
            for given content-type
        """
        scroll_analytics_ctypes = self.get_scroll_registry() or []

        pcs = self.context.restrictedTraverse('@@plone_context_state')
        is_view_template = pcs.is_view_template()
        return self.context.portal_type in scroll_analytics_ctypes and \
               is_view_template and \
               self.context.portal_membership.isAnonymousUser()

    @memoize
    def get_scroll_registry(self):
        """ content registry cache
        """
        registry = getUtility(IRegistry)
        return registry.get('Products.EEAContentTypes.browser.interfaces.'
                            'IEEAContentTypesSettings.scrollAnalyticsFor')

