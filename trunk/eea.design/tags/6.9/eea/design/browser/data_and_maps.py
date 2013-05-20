""" Browser controllers
"""
from Acquisition import aq_inner
from DateTime import DateTime
from Products.CMFCore.utils import getToolByName

from Products.Five import BrowserView

from eea.design.browser.frontpage import _getItems, _getImageUrl
from eea.design.browser.frontpage import _getResultsInAllLanguages
from eea.promotion.interfaces import IPromotion

class DataMaps(BrowserView):
    """
    This browser view class has methods to get all the latest data and maps
    items globally or related to a specific topic.
    """
    __implements__ = (getattr(BrowserView, '__implements__', ()), )

    def __init__(self, context, request):
        BrowserView.__init__(self, context, request)

        self.catalog = getToolByName(context, 'portal_catalog')
        portal_properties = getToolByName(context, 'portal_properties')
        frontpage_properties = getattr(portal_properties,
                                       'frontpage_properties')

        self.promotions = []
        self.portal_url = getToolByName(aq_inner(context), 'portal_url')()
        #default number of items shown in each whatsnew / latest tab/portlet.
        self.noOfLatestDefault = frontpage_properties.getProperty(
            'noOfLatestDefault', 6)
        # noOfEachProduct is used when all latest products are merged together
        # we show equal number of each, so that none
        # products overshadow the others.
        self.noOfEachProduct = frontpage_properties.getProperty(
            'noOfEachProduct', 3)
        self.now = DateTime()

    def getLatestDatasets(self, language=None):
        """ Get latest published datasets. Number configurable via
        ZMI frontpage_properties.
        """
        interfaces = ('eea.dataservice.interfaces.IDataset')
        return _getItems(self,
                         interfaces=interfaces,
                         noOfItems=self.noOfLatestDefault,
                         language=language)

    def getLatestIndicators(self, language=None):
        """ Get latest published indicators. """
        interfaces = ('eea.indicators.content.interfaces.IIndicatorAssessment')
        return _getItems(self,
                         interfaces=interfaces,
                         noOfItems=self.noOfLatestDefault,
                         language=language)

    def getLatestMaps(self, language=None):
        """ Get latest published static maps. """
        interfaces = ('eea.dataservice.interfaces.IEEAFigureMap')
        return _getItems(self,
                         interfaces=interfaces,
                         noOfItems=self.noOfLatestDefault,
                         language=language)

    def getLatestGraphs(self, language=None):
        """ Get latest published static graphs/charts."""
        interfaces = ('eea.dataservice.interfaces.IEEAFigureGraph')
        return _getItems(self,
                         interfaces=interfaces,
                         noOfItems=self.noOfLatestDefault,
                         language=language)

    def getLatestInteractiveMaps(self, language=None):
        """ Get latest published interactive maps."""
        interfaces = (
            'Products.EEAContentTypes.content.interfaces.IInteractiveMap')
        return _getItems(self,
                         interfaces=interfaces,
                         noOfItems=self.noOfLatestDefault,
                         language=language)

    def getLatestInteractiveData(self, language=None):
        """ Get latest published interactive data charts."""
        interfaces = (
            'Products.EEAContentTypes.content.interfaces.IInteractiveData')
        return _getItems(self,
                         interfaces=interfaces,
                         noOfItems=self.noOfLatestDefault,
                         language=language)


    def getAllProducts(self, no_sort=False, language=None):
        """ Get all latest data and maps merged into one single list """
        result = []
        res1 = self.getLatestIndicators(
            language=language)[:self.noOfEachProduct]
        res2 = self.getLatestDatasets(language=language)[:self.noOfEachProduct]
        res3 = self.getLatestMaps(language=language)[:self.noOfEachProduct]
        res4 = self.getLatestGraphs(language=language)[:self.noOfEachProduct]
        res5 = self.getLatestInteractiveMaps(
            language=language)[:self.noOfEachProduct]
        res6 = self.getLatestInteractiveData(
            language=language)[:self.noOfEachProduct]

        result.extend(res1)
        result.extend(res2)
        result.extend(res3)
        result.extend(res4)
        result.extend(res5)
        result.extend(res6)

        # sort by effective date and then reverse it as it starts from smallest
        if not no_sort:
            result.sort(key=lambda x: x.effective)
            result.reverse()
        return result

    def getPromotions(self):
        """ Retrieves external and internal promotions for data and maps
            section
        """
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
            'sort_order': 'reverse'
        }

        noOfItems = 18
        result = self.catalog(query)
        datasets_interfaces = [
            'Products.EEAContentTypes.content.interfaces.IInteractiveMap',
            'Products.EEAContentTypes.content.interfaces.IInteractiveData',
            'eea.dataservice.interfaces.IEEAFigureGraph',
            'eea.dataservice.interfaces.IDataset',
            'eea.dataservice.interfaces.IEEAFigureMap',
            'eea.indicators.content.interfaces.IIndicatorAssessment']
        cPromos = []
        for brain in result:
            obj = brain.getObject()
            promo = IPromotion(obj)
            obj_interfaces = obj.restrictedTraverse('@@get_interfaces')()
            for i in datasets_interfaces:
                if i in obj_interfaces:
                    if not promo.display_on_datacentre:
                        continue
                    cPromos.append(brain)
                    if len(cPromos) == noOfItems:
                        break

        promotions = len(cPromos)
        if promotions >= 6:
            return cPromos
        else:
            cPromos.extend(self.getAllProducts())
            return list(set(cPromos))

    def getImageUrl(self, brain):
        """ Public method for data-and-maps calling _getImageUrl """
        return _getImageUrl(brain)

    def getResultsInAllLanguages(self, method=None):
        """ Public method for data-and-maps calling
            _getResultsInAllLanguages
        """
        return _getResultsInAllLanguages(self, method)
