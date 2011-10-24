""" Controllers
"""

from Acquisition import aq_inner
from DateTime import DateTime
from Products.CMFCore.utils import getToolByName
from Products.EEAContentTypes.cache import cacheKeyHighlights
from Products.EEAContentTypes.content.interfaces import IFlashAnimation
from Products.Five import BrowserView
from eea.cache import cache
from eea.promotion.interfaces import IPromotion
from eea.themecentre.themecentre import getTheme
from p4a.video.interfaces import IVideoEnhanced
from plone.app.blob.interfaces import IBlobWrapper
from zope.component import queryMultiAdapter

class Frontpage(BrowserView):
    """ Front page
    """
    def __init__(self, context, request):
        BrowserView.__init__(self, context, request)

        self.catalog = getToolByName(context, 'portal_catalog')
        portal_properties = getToolByName(context, 'portal_properties')
        frontpage_properties = getattr(portal_properties,
                                                'frontpage_properties')

        self.promotions = []
        self.portal_url = getToolByName(aq_inner(context), 'portal_url')()

        self.noOfHigh = frontpage_properties.getProperty('noOfHigh', 3)
        self.noOfMedium = frontpage_properties.getProperty('noOfMedium', 4)
        self.noOfLow = frontpage_properties.getProperty('noOfLow', 10)
        self.noOfArticles = frontpage_properties.getProperty('noOfArticles', 6)
        self.noOfNews = frontpage_properties.getProperty('noOfNews', 6)
        self.noOfMultimedia = frontpage_properties.getProperty(
                                                           'noOfMultimedia', 6)
        self.noOfAnimations = frontpage_properties.getProperty(
                                                           'noOfAnimations', 6)
        self.noOfPublications = frontpage_properties.getProperty(
                                                         'noOfPublications', 6)
        self.noOfPromotions = frontpage_properties.getProperty(
                                                           'noOfPromotions', 7)
        self.noOfEachProduct = frontpage_properties.getProperty(
                                                          'noOfEachProduct', 3)
        self.noOfDatasets = frontpage_properties.getProperty('noOfDatasets', 6)
        self.noOfLatestDefault = frontpage_properties.getProperty(
                                                        'noOfLatestDefault', 6)
        self.now = DateTime()


    def getNews(self):
        """ retrieves latest news by date and by topic """
        visibilityLevel = [ 'top', 'middle', 'low' ]
        return _getItems(self, visibilityLevel = visibilityLevel,
                portaltypes = ('Highlight', 'PressRelease'),
                                        noOfItems=self.noOfNews)

    def getArticles(self, portaltypes = "Article"):
        """ retrieves latest articles by date and by topic """
        visibilityLevel = [ 'top', 'middle', 'low' ]
        return _getItems(self, visibilityLevel = visibilityLevel,
                portaltypes = "Article", noOfItems=self.noOfArticles)

    def getPublications(self, portaltypes = "Report"):
        """ retrieves latest publications by date and by topic """
        return _getItems(self, portaltypes = 'Report',
                                    noOfItems=self.noOfPublications)

    def getAllProducts(self):
        """ retrieves all latest published products for frontpage """
        portaltypes = ('Report', 'Article', 'Highlight', 'PressRelease',
                                    'Assessment', 'Data', 'EEAFigure')
        result = []
        for mytype in portaltypes:
            res1 = _getItems(self, portaltypes = mytype,
                        noOfItems=self.noOfEachProduct)
            result.extend(res1)
        multimedia = self.getMultimedia()
        result.extend(multimedia[:self.noOfEachProduct])
        #TODO the list must be re-sorted on effective date.
        return result

#    @cache(cacheKeyHighlights, dependencies=['frontpage-highlights'])
    def getHigh(self, portaltypes = ('Highlight', 'PressRelease'),
                                    scale = 'thumb', topic = ''):
        """ retrieves high visibility portaltypes """
        visibilityLevel = 'top'
        topic = topic
        results =  _getItemsWithVisibility(self, visibilityLevel,
                        portaltypes, topic = topic)[:self.noOfHigh]
        highlights = []
        for high in results:
            highlights.append ( self._getTeaserMedia(high, scale) )

        return highlights

    def getHighArticles(self):
        """ return a defined number of high visibility articles items """
        return _getHighArticles(self, noOfItems=self.noOfHigh)

    def getSpotlight(self):
        """ retrieves promoted item that has the spotlight promotion
        assigned
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
            'sort_order' : 'reverse',
            'effectiveRange' : self.now,
        }

        result = self.catalog(query)
        spotlight = []
        for brain in result:
            obj = brain.getObject()
            promo = IPromotion(obj)
            if not promo.display_in_spotlight:
                continue
            if not promo.active:
                continue
            spotlight.append(brain)
            break
        return spotlight

    def getPromotions(self):
        """ Promotions
        """
        result = _getPromotions(self, noOfItems = self.noOfPromotions)
        return result

    def getMultimedia(self):
        """ retrieves multimedia videos filtered by date and by topic """
        result = _getItems(self,
                    interfaces = 'p4a.video.interfaces.IVideoEnhanced',
                    noOfItems=self.noOfMultimedia)
        result = [i for i in result if not IFlashAnimation.providedBy(
                                          i.getObject())][:self.noOfMultimedia]
        return result

    def getAnimations(self):
        """ retrieves multimedia swf animations filtered by date and topic """
        result = _getItems(self, interfaces = \
                'Products.EEAContentTypes.content.interfaces.IFlashAnimation',
                noOfItems = self.noOfAnimations)
        return result

    def _getTeaserMedia(self, high, scale):
        """ teaser media utility method """
        obj = high.getObject()
        media = obj.getMedia()
        media_url = media_type = media_title = media_copy = media_note = ''
        if media:
            if IBlobWrapper.providedBy(media):
                media_url = obj.absolute_url() + '/image'
            else:
                media_url = media.absolute_url()

            if obj.absolute_url() in media_url:
                # image in image field
                media_type = 'Image'
                media_title = obj.getImageCaption()
                media_copy = obj.getImageCopyright()
                media_note = obj.getImageNote()
            else:
                # reference to an Image or FlashFile
                media_type = media.portal_type
                media_title = media.Title()
                media_copy = media.Rights()
                media_note = media.Description()

        adapter = queryMultiAdapter((obj, self.request), name=u'themes-object',
                                                                default=None)
        themes = []
        if adapter is not None:
            themes = adapter.short_items()
        result = {
                 'id'                 : high['id'],
                 'getUrl'             : high.get('getUrl',high.getURL()),
                 'getNewsTitle'       : high['getNewsTitle'],
                 'getTeaser'          : high['getTeaser'],
                 'effective'          : high['effective'],
                 'expires'            : high['expires'],
                 'getVisibilityLevel' : high['getVisibilityLevel'],
                 'themes'             : themes,
                  }

        if media is not None:
            result['media'] = {
                    'absolute_url' : media_url,
                    'portal_type'  : media_type,
                    'Title'        : media_title,
                    'Rights'       : media_copy,
                    'Description'  : media_note,
                    'getScale'     : ''
                }
            if IBlobWrapper.providedBy(media):
                result['media']['getScale'] = obj.getField('image').tag(
                                                            obj, scale=scale)

        return result

## deprecated visibility methods
    cache(cacheKeyHighlights, dependencies = ['frontpage-highlights'])
    def getLow(self, portaltypes = ('Highlight', 'PressRelease'),
                                                        scale='dummy'):
        """ Low
        """
        visibilityLevel = [ 'top', 'middle', 'bottom' ]
        otherIds = [ h['id'] for h in self.getMedium(portaltypes) ]
        otherIds.extend( [ high['id'] for high in self.getHigh(portaltypes) ] )
        result =  _getItemsWithVisibility(self, visibilityLevel, portaltypes) \
                            [:self.noOfHigh + self.noOfMedium + self.noOfLow]
        highlights = []

        for high in result:
            # remove highlights that are display as top or middle
            if high['id'] not in otherIds:
                obj = high.getObject()
                adapter = queryMultiAdapter((obj, self.request),
                                        name=u'themes-object', default=None)
                themes = []
                if adapter is not None:
                    themes = adapter.short_items()

                highlights.append( { 'id' : high['id'],
                 'getUrl' : high['getUrl'] or high.getURL(),
                 'getNewsTitle' : high['getNewsTitle'],
                 'getTeaser' : high['getTeaser'],
                 'effective' : high['effective'],
                 'expires' : high['expires'],
                 'getVisibilityLevel' : high['getVisibilityLevel'],
                 'themes':themes,
                  })

        return highlights[:self.noOfLow]

    @cache(cacheKeyHighlights, dependencies=['frontpage-highlights'])
    def getMedium(self, portaltypes = ('Highlight', 'PressRelease'),
                                                    scale = 'thumb'):
        """ Medium
        """
        visibilityLevel = [ 'top', 'middle' ]
        result =  _getItemsWithVisibility(self, visibilityLevel, portaltypes) \
                                            [:self.noOfMedium + self.noOfHigh]
        topIds = [ h['id'] for h in self.getHigh(portaltypes) ]
        highlights = []
        #topRemoved = 0
        for high in result:
            # remove the self.noOfHigh top highlights from the result,
            # they are displayd on top
            if high['id'] not in topIds:
                highlights.append ( self._getTeaserMedia(high, scale) )

        return highlights[:self.noOfMedium]

    def getMediumArticles(self):
        """ return a defined number of medium visibility articles items """
        results =  self.getMedium(('Article', ))
        return results

    def getLowArticles(self):
        """ return a defined number of low visibility articles items """
        results =  self.getLow(('Article', ))
        return results
## end deprecated visibility methods

## Utility functions

def _getPromotions(self, noOfItems = 6):
    """ utility function to retrieve external and internal promotions """
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

    themes = getTheme(self.context.aq_inner)
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
        else:
            if not promo.display_on_frontpage:
                continue
        if not promo.active:
            continue
        cPromos.append(obj)
        if len(cPromos) == noOfItems:
            break
    return cPromos

def _getHighArticles(self, noOfItems = 1):
    """ utility function to return a defined number of high visibility
    articles items
    """
    visibilityLevel = ['top']
    return _getItems(self, visibilityLevel = visibilityLevel,
                        portaltypes = 'Article', noOfItems=noOfItems)

def _getItemsWithVisibility(self, visibilityLevel = '', portaltypes = '',
                                            interfaces = '', topic = ''):
    """ retrieves items of certain content types and/or interface
    and certain visibility level.
    """
    query = {
            'review_state'       : 'published',
            'sort_on'            : 'effective',
            'sort_order'         : 'reverse',
            'effectiveRange'     : self.now }
    if portaltypes:
        query['portal_type'] = portaltypes
    if visibilityLevel:
        query['getVisibilityLevel'] = visibilityLevel
    if interfaces:
        query['object_provides'] = interfaces
    if topic:
        query['getThemes'] = topic
    return self.catalog.searchResults(query)

def _getTopics(self, topic = '', portaltypes = '', object_provides = '',
                                            tags = '', noOfItems = ''):
    """ retrieves items of certain content types and/or interface and
    certain visibility level, with the addition of topic filtering """
    query = {
        'review_state': 'published',
        'sort_on': 'effective',
        'sort_order' : 'reverse',
        'effectiveRange' : self.now,
        }
    if portaltypes:
        query['portal_type'] = portaltypes
    if object_provides:
        query['object_provides'] = object_provides
    if topic:
        query['getThemes'] = topic
    if tags:
        query['Subject'] = tags
    return self.catalog(query)[:noOfItems]


def _getItems(self, visibilityLevel=None, portaltypes=None, interfaces=None,
                                                                noOfItems=6):
    """ generic internal method for getting items from catalog
    (via portaltypes or via interfaces) filtered by topic or not.
    """
    visibilityLevel = visibilityLevel or ''
    result = []
    #if topic is not passed in the REQUEST variable
    #then we try to get it from the context object
    topic = getattr(self.context.REQUEST, 'topic', None)
    tags = getattr(self.context.REQUEST, 'tags', None)
    topic_request = getTheme(self.context.aq_inner)
    if topic or topic_request:
        topic = topic if topic else topic_request

    if portaltypes:
        #if there is a topic/theme tag then get items filtered
        if topic:
            result = _getTopics(self, portaltypes = portaltypes,
                    topic = topic, noOfItems=noOfItems)
        elif tags:
            result = _getTopics(self, portaltypes = portaltypes,
                                tags = tags, noOfItems=noOfItems)
        else:
            result =  _getItemsWithVisibility(self,
                                        visibilityLevel = visibilityLevel,
                                        portaltypes  = portaltypes)[:noOfItems]
    elif interfaces:
        #if there is a topic/theme tag then get items filtered
        if topic:
            result = _getTopics(self, object_provides = interfaces,
                                            topic = topic, noOfItems=noOfItems)
        elif tags:
            result = _getTopics(self, object_provides = interfaces,
                                tags = tags, noOfItems=noOfItems)
        else:
            result =  _getItemsWithVisibility(self,
                                            visibilityLevel = visibilityLevel,
                                        interfaces  = interfaces)[:noOfItems]

    return result
