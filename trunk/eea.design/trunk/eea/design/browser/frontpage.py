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

from zope.component import queryMultiAdapter, getMultiAdapter
from plone.memoize.ram import cache

from Acquisition import aq_inner, aq_parent
from DateTime import DateTime
from Products.CMFCore.utils import getToolByName

from eea.promotion.interfaces import IPromotion

from Products.Five import BrowserView
from Products.EEAContentTypes.cache import cacheKeyPromotions, cacheKeyHighlights
from Products.EEAContentTypes.promotion import getPromotionFolder

class Frontpage(BrowserView):
    """
    """
    __implements__ = (getattr(BrowserView,'__implements__',()),)

    ##code-section class-header_Frontpage #fill in your manual code here
    ##/code-section class-header_Frontpage


    def __init__(self, context, request):
        BrowserView.__init__(self, context, request)

        self.catalog = getToolByName(context, 'portal_catalog')
        portal_properties = getToolByName(context, 'portal_properties')
        frontpage_properties = getattr(portal_properties, 'frontpage_properties')

        self.promotionFolder = getPromotionFolder(context)
        self.promotions = []
        self.portal_url = getToolByName(aq_inner(context), 'portal_url')()
        
        self.noOfHigh = frontpage_properties.getProperty('noOfHigh', 3)
        self.noOfMedium = frontpage_properties.getProperty('noOfMedium', 4)
        self.noOfLow = frontpage_properties.getProperty('noOfLow', 10)
        self.now = DateTime()

    @cache(cacheKeyHighlights)
    def getHigh(self,portaltypes=('Highlight', 'PressRelease'),scale='thumb'):
        visibilityLevel='top'
        results =  self._getItemsWithVisibility(visibilityLevel,portaltypes)[:self.noOfHigh]
        highlights = []
        for high in results:
            highlights.append ( self._getTeaserMedia(high, scale) )

        return highlights

    @cache(cacheKeyHighlights)
    def getMedium(self,portaltypes=('Highlight', 'PressRelease'),scale='thumb'):
        visibilityLevel=[ 'top', 'middle' ]
        result =  self._getItemsWithVisibility(visibilityLevel,portaltypes)[:self.noOfMedium + self.noOfHigh]
        topIds = [ h['id'] for h in self.getHigh(portaltypes) ]
        highlights = []
        topRemoved = 0
        for high in result:
            # remove the self.noOfHigh top highlights from the result, they are displayd on top
            if high['id'] not in topIds:
                highlights.append ( self._getTeaserMedia(high, scale) )

        return highlights[:self.noOfMedium]

    @cache(cacheKeyHighlights)
    def getLow(self,portaltypes=('Highlight', 'PressRelease'),scale='dummy'):
        visibilityLevel=[ 'top', 'middle', 'bottom' ]
        otherIds = [ h['id'] for h in self.getMedium(portaltypes) ]
        otherIds.extend( [ h['id'] for h in self.getHigh(portaltypes) ] )
        result =  self._getItemsWithVisibility(visibilityLevel,portaltypes)[:self.noOfHigh + self.noOfMedium + self.noOfLow]
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

    def getHighArticles(self):
        """ return a defined number of high visibility articles items """
        results =  self.getHigh(('Article',),'thumb')
        return results

    def getMediumArticles(self):
        """ return a defined number of medium visibility articles items """
        results =  self.getMedium(('Article',))
        return results

    def getLowArticles(self):
        """ return a defined number of low visibility articles items """
        results =  self.getLow(('Article',))
        return results


    @cache(cacheKeyPromotions)
    def getPromotions(self):
        if self.promotionFolder is None:
            return

        # Each folder in quicklinks represents a category:
        categories = []
        query = {'path' : { 'query': self.promotionFolder, 'depth' : 2 },
                 'review_state' : 'published',
                 'portal_type': ['Folder'],
                 'sort_on' : 'getObjPositionInParent',
                 'effectiveRange' : self.now}
        result = self.catalog.searchResults(query)
        for t in result:
            macro = getattr(t, 'promotion_macro', None)
            categories.append( { 'id' : t.id,
                                 'Title' : t.Title,
                                 'url' : t.getURL(),
                                 'path' : t.getPath(),
                                 'macro' : macro or 'here/portlet_promotions/macros/portlet' } )

        # External promotions
        query = {'path' : { 'query': self.promotionFolder, 'depth' : 2 },
                 'review_state' : 'published',
                 'object_provides': 'Products.EEAContentTypes.content.interfaces.IExternalPromotion',
                 'sort_on' : 'getObjPositionInParent',
                 'effectiveRange' : self.now}
        result1 = self.catalog.searchResults(query)

        # Internal promotions
        query = {'object_provides': 'eea.promotion.interfaces.IPromoted',
                 'review_state': 'published',
                 'effectiveRange' : self.now}
        result2 = self.catalog.searchResults(query)

        cPromos = {}
        for t in result1 + result2:
            obj = t.getObject()
            promo = IPromotion(obj)
            if not promo.display_on_frontpage:
                continue
            if promo.frontpage_section is None or promo.frontpage_section == '':
                continue
            parentPath = promo.frontpage_section
            promos = cPromos.get(parentPath, [])

            # To produce valid HTML and make the promotion slider work, we
            # make sure that the id is unique to the category
            ids = [i['id'] for i in promos]
            unique_id = t.getId
            i = 0
            while unique_id in ids:
                i += 1
                unique_id = '%s-%i' % (t.getId, i)

            info = {'id' : unique_id,
                    'Description' : t.Description,
                    'Title' : t.Title,
                    'url' : promo.url,
                    'style' : 'display: none;',
                    'imglink' : getMultiAdapter((obj, obj.REQUEST),
                         name='promo_imglink')('thumb'),
                    'image' : t.getURL() + '/image' }
            promos.append(info)
            cPromos[parentPath] = promos

        promotions = []
        for category in categories:
            promos = cPromos.get(category['path'], None)
            if promos is not None:
                promos[0]['style'] = 'display: block;'
                promotions.append({ 'category' : category,
                                    'promotions' : promos })
        return promotions

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
            
        result = { 'id' : high['id'],
                 'getUrl' : high.get('getUrl',high.getURL()),
                 'getNewsTitle' : high['getNewsTitle'],
                 'getTeaser' : high['getTeaser'],
                 'effective' : high['effective'],
                 'expires' : high['expires'],
                 'getVisibilityLevel' : high['getVisibilityLevel'],
                 'themes' : themes,
                  }

        if media is not None:
            result['media'] = { 'absolute_url' :  media_url,
                                'portal_type' : media_type,
                                'Title' : media_title,
                                'Rights' : media_copy,
                                'Description' : media_note,
                                'getScale' : '' }
            if hasattr(media, 'getScale'):
                result['media']['getScale'] = media.getScale(scale).tag()
                    
        return result


    def _getHighlights(self, visibilityLevel):
        """ Deprecated: use more generic _getItemsWithVisibility method instead. """
        results=self._getItemsWithVisibility(visibilityLevel,('Highlight', 'PressRelease'))
        return results

    def _getItemsWithVisibility(self, visibilityLevel, portaltypes, interfaces=None):
        """ get items of certain content types and/or interface and certain visibility level. """
        # TODO: add functionality for optional param interfaces
        query = { 'portal_type' : portaltypes,
                  'review_state' : 'published',
                  'getVisibilityLevel' : visibilityLevel,
                  'sort_on' : 'effective',
                  'sort_order' : 'reverse',
                  'effectiveRange' : self.now }
        return self.catalog.searchResults(query)
        
    


class FrontpageCache(BrowserView):
    """ This view knows how to get the last modified date for the root of the
        site. The date is used by squid for caching the front page. """

    def modified(self):
        catalog = getToolByName(self.context, 'portal_catalog')
        portal_props = getToolByName(self.context, 'portal_properties')
        frontpage_props = getattr(portal_props, 'frontpage_properties')
        utool = getToolByName(self.context, 'portal_url')

        root = utool.getPortalObject()
        rss = getattr(root, 'rss', None)
        promotionFolder = frontpage_props.getProperty('promotionFolder', None)
        query1 = query2 = query3 = None

        if rss:
            query1 = { 'portal_type': ['RSSFeedRecipe'],
                       'path': { 'query': '/'.join(rss.getPhysicalPath()),
                                 'depth': 1 },
                       'sort_on': 'modified' }
        query2 = { 'portal_type': ['Highlight', 'PressRelease'],
                   'sort_on': 'effective',
                   'review_state': 'published',
                   'effectiveRange': DateTime() }
        if promotionFolder:
            query3 = { 'portal_type': ['Promotion'],
                       'path': { 'query': promotionFolder, 'depth': 2 },
                       'review_state': 'published',
                       'sort_on': 'modified' }

        dates = []
        for query in filter(None, (query1, query2, query3)):
            res = catalog.searchResults(query)
            if res:
                dates.append(res[-1].modified)

        if dates:
            return max(dates)
        else:
            return None

