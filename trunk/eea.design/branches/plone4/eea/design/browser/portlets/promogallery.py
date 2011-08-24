from zope.interface import implements

from plone.portlets.interfaces import IPortletDataProvider
from plone.app.portlets.portlets import base

from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

from p4a.video.interfaces import IVideoEnhanced
from eea.themecentre.themecentre import getTheme
from eea.promotion.interfaces import IPromotion
from plone.memoize.compress import xhtml_compress
from Products.CMFCore.utils import getToolByName

from DateTime import DateTime
from zope.component import getMultiAdapter


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
        frontpage_properties = getattr(portal_properties, 'frontpage_properties')

        self.noOfPromotions = frontpage_properties.getProperty('noOfPromotions', 7)

    def render(self):
        return xhtml_compress(self._template())

    @property
    def available(self):
        """Show the portlet only if there are one or more elements."""
        plone = getMultiAdapter((self.context, self.request), name=u'plone_context_state')
        return plone.is_view_template() and len(self._data())

    def get_promotions(self):
        """ promotions """
        return self._data()

    def _data(self):
        """ retrieves external and internal promotions """
        query = {
            'object_provides': {
                'query': [
                    'eea.promotion.interfaces.IPromoted',
                    'Products.EEAContentTypes.content.interfaces.IExternalPromotion',
                ],
                'operator': 'or',
            },
            'review_state': 'published',
            'sort_on': 'effective',
            'sort_order' : 'reverse',
            'effectiveRange' : self.now,
        }
        themes = getTheme(self.context)
        if themes:
            query['getThemes'] = getTheme(self.context.aq_inner.aq_parent)
        result = self.catalog(query)
        cPromos = []
        for brain in result:
            obj = brain.getObject()
            promo = IPromotion(obj)

            if IVideoEnhanced.providedBy(obj):
                continue
            if themes:
                if not promo.display_on_themepage:
                    continue
            if not promo.active:
                continue
            cPromos.append(obj)
            if len(cPromos) == self.noOfPromotions:
                break
        return cPromos

class AddForm(base.NullAddForm):
    """Portlet add form.
    """
    def create(self):
        return Assignment()


