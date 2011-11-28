""" Gallery
"""
from zope.interface import implements

from plone.portlets.interfaces import IPortletDataProvider
from plone.app.portlets.portlets import base

from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

from plone.memoize.compress import xhtml_compress
from Products.CMFCore.utils import getToolByName

from DateTime import DateTime
from zope.component import getMultiAdapter
from eea.design.browser.frontpage import _getPromotions

class IPromoGallery(IPortletDataProvider):
    """Promo Gallery portlet
    """

class Assignment(base.Assignment):
    """Portlet assignment.
    This is what is actually managed through the portlets UI and associated
    with columns.
    """
    implements(IPromoGallery)

    def __init__(self):
        pass

    @property
    def title(self):
        """This property is used to give the title of the portlet in the
        "manage portlets" screen.
        """
        return "EEA Promotion Gallery"

class Renderer(base.Renderer):
    """Portlet renderer.
    """
    _template = ViewPageTemplateFile('promogallery.pt')

    def __init__(self, *args):
        """ init """
        base.Renderer.__init__(self, *args)
        context = self.context
        self.now = DateTime()
        self.catalog = getToolByName(context, 'portal_catalog')
        portal_properties = getToolByName(context, 'portal_properties')
        frontpage_properties = getattr(portal_properties,
                                       'frontpage_properties')

        self.noOfItems = frontpage_properties.getProperty('noOfPromotions', 7)

    def render(self):
        """ Render
        """
        return xhtml_compress(self._template())

    @property
    def available(self):
        """Show the portlet only if there are one or more elements."""
        plone = getMultiAdapter((self.context, self.request),
                                name=u'plone_context_state')
        return plone.is_view_template() and len(self.get_promotions())

    def get_promotions(self):
        """ promotions """
        result = _getPromotions(self, noOfItems = self.noOfItems)
        return result

class AddForm(base.NullAddForm):
    """Portlet add form.
    """
    def create(self):
        """ Create
        """
        return Assignment()


