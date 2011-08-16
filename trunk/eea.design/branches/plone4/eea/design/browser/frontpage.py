# -*- coding: utf-8 -*-
#
# File: frontpage.py
#
# Copyright (c) 2006 by []
# Generator: ArchGenXML Version 1.5.1-svn
#            http://plone.org/products/archgenxml
#
# GNU General Public License (GPL)
#
# This program is free software; you can redistribute it and/or
# modify it under the terms of the GNU General Public License
# as published by the Free Software Foundation; either version 2
# of the License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
# 02110-1301, USA.
#

__author__ = """unknown <unknown>"""
__docformat__ = 'plaintext'

from zope.component import queryMultiAdapter #, getMultiAdapter
from eea.cache import cache

from Acquisition import aq_inner
from DateTime import DateTime
from Products.CMFCore.utils import getToolByName

from eea.promotion.interfaces import IPromotion

from Products.Five import BrowserView
from Products.EEAContentTypes.content.interfaces import IFlashAnimation
from Products.EEAContentTypes.cache import cacheKeyPromotions, cacheKeyHighlights

from p4a.video.interfaces import IVideoEnhanced
#from eea.themecentre.interfaces import IThemeTagging , IThemeTaggable
#from eea.themecentre.interfaces import IThemeCentreSchema

class Frontpage(BrowserView):
    """
    """
    __implements__ = (getattr(BrowserView, '__implements__', ()), )

    def __init__(self, context, request):
        BrowserView.__init__(self, context, request)

        self.catalog = getToolByName(context, 'portal_catalog')
        portal_properties = getToolByName(context, 'portal_properties')
        frontpage_properties = getattr(portal_properties, 'frontpage_properties')

        self.promotions = []
        self.portal_url = getToolByName(aq_inner(context), 'portal_url')()
        
        self.noOfHigh = frontpage_properties.getProperty('noOfHigh', 3)
        self.noOfMedium = frontpage_properties.getProperty('noOfMedium', 4)
        self.noOfLow = frontpage_properties.getProperty('noOfLow', 10)
        self.noOfArticles = frontpage_properties.getProperty('noOfArticles', 4)
        self.noOfNews = frontpage_properties.getProperty('noOfNews', 4)
        self.noOfMultimedia = frontpage_properties.getProperty('noOfMultimedia', 6)
        self.noOfPublications = frontpage_properties.getProperty('noOfPublications', 6)
        self.noOfPromotions = frontpage_properties.getProperty('noOfPromotions', 7)
        self.noOfEachProduct = frontpage_properties.getProperty('noOfEachProduct', 3)
        self.now = DateTime()

#    @cache(cacheKeyHighlights, dependencies=['frontpage-highlights'])
    def getHigh(self, portaltypes = ('Highlight', 'PressRelease'), scale = 'thumb', topic = ''):
        visibilityLevel = 'top'
        topic = topic
        results =  self._getItemsWithVisibility(visibilityLevel, portaltypes, topic = topic)[:self.noOfHigh]
        highlights = []
        for high in results:
            highlights.append ( self._getTeaserMedia(high, scale) )

        return highlights

    @cache(cacheKeyHighlights, dependencies=['frontpage-highlights'])
    def getMedium(self, portaltypes = ('Highlight', 'PressRelease'), scale = 'thumb'):
        visibilityLevel = [ 'top', 'middle' ]
        result =  self._getItemsWithVisibility(visibilityLevel, portaltypes)[:self.noOfMedium + self.noOfHigh]
        topIds = [ h['id'] for h in self.getHigh(portaltypes) ]
        highlights = []
        #topRemoved = 0
        for high in result:
            # remove the self.noOfHigh top highlights from the result, they are displayd on top
            if high['id'] not in topIds:
                highlights.append ( self._getTeaserMedia(high, scale) )

        return highlights[:self.noOfMedium]

    def getNews(self, portaltypes = ('Highlight', 'PressRelease'), scale = 'mini'):
        topic = getattr( self.context.REQUEST, 'topic', None)
        if topic:
            result = self._getTopics(portaltypes = portaltypes,
                                 topic = topic, noOfItems=self.noOfNews)
            return result
        visibilityLevel = [ 'top', 'middle', 'low' ]
        result =  self._getItemsWithVisibility(visibilityLevel,  portaltypes)[:self.noOfNews]
        return result

    def getArticles(self, portaltypes = "Article"):
        topic = getattr( self.context.REQUEST, 'topic', None)
        if topic:
            result = self._getTopics(portaltypes = "Article", 
                                 topic = topic, noOfItems=self.noOfArticles)
            return result
        visibilityLevel = [ 'top', 'middle', 'low' ]
        result =  self._getItemsWithVisibility(visibilityLevel, portaltypes)[:self.noOfArticles]
        return result

    def getPublications(self, portaltypes = "Report"):
        topic = getattr( self.context.REQUEST, 'topic', None)
        if topic:
            result = self._getTopics(portaltypes = "Report", 
                                 topic = topic, noOfItems=self.noOfPublications)
            return result
        visibilityLevel = ''
        result =  self._getItemsWithVisibility(visibilityLevel, portaltypes  = portaltypes)[:self.noOfPublications]
        return result
    

    def getAllProducts(self):
        """ get all latest published products for frontpage """
        portaltypes = ('Report','Article','Highlight','PressRelease', 'Data', 'EEAFigure')
        interfaces = 'p4a.video.interfaces.IVideoEnhanced'
        visibilityLevel = ''
        topic = getattr(self.context.REQUEST, 'topic', None)
        result = []
        for mytype in portaltypes:
            if topic:
                result2 = self._getTopics(portaltypes = mytype , 
                                 topic = topic, noOfItems=self.noOfEachProduct)
            else:
                result2 =  self._getItemsWithVisibility(visibilityLevel, portaltypes  = mytype)[:self.noOfEachProduct]
            result.extend(result2)
            
        multimedia = self.getMultimedia();
        result.extend(multimedia)
        #TODO the list must be re-sorted on effective date.
        
        return result

    def getHighArticles(self, topic = ''):
        """ return a defined number of high visibility articles items """
        if topic: 
            topic = self.context.aq_inner.aq_parent.id
            results =  self.getHigh(('Article', ), 'thumb', topic)
            return results
        results =  self.getHigh(('Article', ), 'thumb')
        return results

    def getSpotlight(self):
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
        Spotlight = {}
        for brain in result:
            obj = brain.getObject()
            promo = IPromotion(obj)
            if not promo.display_in_spotlight:
                continue
            if not promo.active:
                continue
            Spotlight['effective'] = brain.effective
            Spotlight['title'] = obj.Title()
            Spotlight['description'] = obj.Description()
            Spotlight['url'] = obj.absolute_url()
            break
        return Spotlight
        
    cache(cacheKeyHighlights, dependencies = ['frontpage-highlights'])
    def getLow(self, portaltypes = ('Highlight', 'PressRelease'), scale='dummy'): 
        visibilityLevel = [ 'top', 'middle', 'bottom' ] 
        otherIds = [ h['id'] for h in self.getMedium(portaltypes) ] 
        otherIds.extend( [ high['id'] for high in self.getHigh(portaltypes) ] )
        result =  self._getItemsWithVisibility(visibilityLevel, portaltypes)[:self.noOfHigh + self.noOfMedium + self.noOfLow] 
        highlights = [] 

        for high in result: 
            # remove highlights that are display as top or middle 
            if high['id'] not in otherIds: 
                obj = high.getObject() 
                adapter = queryMultiAdapter((obj, self.request), name=u'themes-object', default=None) 
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

    def getMediumArticles(self): 
        """ return a defined number of medium visibility articles items """ 
        results =  self.getMedium(('Article', )) 
        return results 
 
    def getLowArticles(self): 
        """ return a defined number of low visibility articles items """ 
        results =  self.getLow(('Article', )) 
        return results 

    def _getHighlights(self, visibilityLevel): 
        """ Deprecated: use more generic _getItemsWithVisibility method instead. """ 
        results = self._getItemsWithVisibility(visibilityLevel, ('Highlight', 'PressRelease')) 
        return results 

    def getPromotions(self):
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
        themes = 'themes' in self.context.REQUEST.URL0
        if themes:
            query['getThemes'] = self.context.aq_inner.aq_parent.id
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
            if len(cPromos) == self.noOfPromotions:
                break
        return cPromos

    def getMultimedia(self):
        topic = getattr( self.context.REQUEST, 'topic', None)
        if topic:
            result = self._getTopics(object_provides= 
                                        'p4a.video.interfaces.IVideoEnhanced', 
                                 topic = topic, noOfItems=self.noOfMultimedia)
            return result
        visibilityLevel = ''
        result = self._getItemsWithVisibility(visibilityLevel, 
                            interfaces = 'p4a.video.interfaces.IVideoEnhanced')
        result = [i for i in result if not IFlashAnimation.providedBy(
                                          i.getObject())][:self.noOfMultimedia]
        return result

    def _getTeaserMedia(self, high, scale):
        obj = high.getObject()
        media = obj.getMedia()
        media_url = media_type = media_title = media_copy = media_note = ''
        if media:
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

        adapter = queryMultiAdapter((obj, self.request), name=u'themes-object', default=None)
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
            getscale = getattr(media, 'getScale', None)
            if getscale:
                result['media']['getScale'] = media.getScale(scale).tag()
        return result

    def _getItemsWithVisibility(self, visibilityLevel = '', portaltypes = '', interfaces = '', topic = ''):
        """ get items of certain content types and/or interface and certain visibility level. """
        query = {
                'portal_type'        : portaltypes,
                'review_state'       : 'published',
                'getVisibilityLevel' : visibilityLevel,
                'sort_on'            : 'effective',
                'sort_order'         : 'reverse',
                'effectiveRange'     : self.now
              }
        if interfaces:
            query['object_provides'] = interfaces
            return self.catalog.searchResults(query)
        elif topic:
            query['getThemes'] = topic
            return self.catalog.searchResults(query)
        return self.catalog.searchResults(query)

    def _getTopics(self, topic = '', portaltypes = '', object_provides = '', noOfItems = ''):
        query = {
            'object_provides': object_provides,
            'portal_type' : portaltypes,
            'review_state': 'published',
            'sort_on': 'effective',
            'sort_order' : 'reverse',
            'effectiveRange' : self.now,
        }
        query['getThemes'] = topic
        return self.catalog(query)[:noOfItems]
