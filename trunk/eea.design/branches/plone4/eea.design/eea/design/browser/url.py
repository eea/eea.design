from zope.interface import implements
from Products.CMFCore.utils import getToolByName
from interfaces import IURL

# TODO: remove this file when EEAContentTypes is compat with plone 4

class URL(object):
    """ This adapter is frequently used in templates to get the url of an
        object. If it's a Link object the listing_url method returns the
        remoteUrl field of that object.
    """

    implements(IURL)

    def __init__(self, context, request):
        self.context = context
        self.request = request
        self._external = False

    def listing_url(self, brain=None):
        #mship = getToolByName(self.context, 'portal_membership')

        if brain is None:
            portal_type = self.context.portal_type
        else:
            portal_type = brain.portal_type

        if portal_type == 'Promotion':
            self._external = True
            if brain is None:
                return self.context.getUrl()
            else:
                return brain.getUrl
        elif portal_type == 'Link':
            self._external = True
            if brain is None:
                return self.context.getRemoteUrl()
            else:
                return brain.getRemoteUrl
        else:
            return self.object_url(brain=brain)

    def object_url(self, brain=None):
        portal_props = getToolByName(self.context, 'portal_properties')
        site_props = getattr(portal_props, 'site_properties')
        use_view_action = getattr(site_props, 'typesUseViewActionInListings', [])
        self._external = False

        if brain is None:
            portal_type = self.context.portal_type
        else:
            portal_type = brain.portal_type

        if portal_type in use_view_action:
            if brain is None:
                return self.context.absolute_url() + '/view'
            else:
                return brain.getURL() + '/view'
        else:
            if brain is None:
                return self.context.absolute_url()
            else:
                return brain.getURL()

    def is_external(self):
        return self._external

    def css_class(self):
        return ''

