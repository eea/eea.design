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
from Products.EEAContentTypes.cache import cacheKeyPromotions, cacheKeyHighlights

from eea.themecentre.themecentre import getTheme

class DataMaps(BrowserView):
    """
    This browser view class has methos to get all the latest data and maps 
    items globally or related to a specific topic. 
    """
    __implements__ = (getattr(BrowserView, '__implements__', ()), )

    def __init__(self, context, request):
        BrowserView.__init__(self, context, request)

        self.catalog = getToolByName(context, 'portal_catalog')
        portal_properties = getToolByName(context, 'portal_properties')
        frontpage_properties = getattr(portal_properties, 'frontpage_properties')

        self.promotions = []
        self.portal_url = getToolByName(aq_inner(context), 'portal_url')()
        #default number of items shown in each whatsnew / latest tab/portlet.
        self.noOfLatestDefault = frontpage_properties.getProperty('noOfLatestDefault', 6)
        # noOfEachProduct is used when all latest products are merged together
        # we show equal number of each, so that none products overshadow the others.
        self.noOfEachProduct = frontpage_properties.getProperty('noOfEachProduct', 3)
        self.now = DateTime()
        
    def getLatestDatasets(self):
        """ Get latest published datasets. Number configurable via ZMI frontpage_properties. """
        return self._getItems(None,('eea.dataservice.interfaces.IDataset'),self.noOfLatestDefault)
        
    def getLatestIndicators(self):
        """ Get latest published indicators. """            
        return self._getItems(None,('eea.indicators.content.interfaces.IIndicatorAssessment'),self.noOfLatestDefault)
        
    def getLatestMaps(self):
        """ Get latest published static maps. """            
        return self._getItems(None,('eea.dataservice.interfaces.IEEAFigureMap'),self.noOfLatestDefault)
        
    def getLatestGraphs(self):
        """ Get latest published static graphs/charts."""
        return self._getItems(None,('eea.dataservice.interfaces.IEEAFigureGraph'),self.noOfLatestDefault)
        
    def getLatestInteractiveMaps(self):
        """ Get latest published interactive maps."""
        return self._getItems(None,('Products.EEAContentTypes.content.interfaces.IInteractiveMap'),self.noOfLatestDefault)
        
    def getLatestInteractiveData(self):
        """ Get latest published interactive data charts."""
        return self._getItems(None,('Products.EEAContentTypes.content.interfaces.IInteractiveData'),self.noOfLatestDefault)
        

    def getAllProducts(self):
        """ get all latest data and maps merged into one single list """
        result = []
        res1 = self.getLatestDatasets()[:self.noOfEachProduct];
        res2 = self.getLatestIndicators()[:self.noOfEachProduct];
        res3 = self.getLatestMaps()[:self.noOfEachProduct];
        res4 = self.getLatestGraphs()[:self.noOfEachProduct];
        res5 = self.getLatestInteractiveMaps()[:self.noOfEachProduct];
        res6 = self.getLatestInteractiveData()[:self.noOfEachProduct];
        
        result.extend(res1)
        result.extend(res2)
        result.extend(res3)
        result.extend(res4)
        result.extend(res5)
        result.extend(res6)
        
        #TODO/OPTIONAL the list may be re-sorted on effective date.
        
        return result


    def _getItems(self,portaltypes=None,interfaces=None,noOfItems=6):
        """ generic internal method for getting items from catalog (via portaltypes or via interfaces)
        filtered by topic or not."""
        visibilityLevel = ''
        result = []
        #if topic is not passed in the REQUEST variable
        #then we try to get it from the context object
        topic = getattr(self.context.REQUEST, 'topic', None)       
        topic_request = getTheme(self.context)
        if topic or topic_request:
            topic = [topic if topic else topic_request].pop()
            
        if portaltypes:
           #if there is a topic/theme tag then get items filtered 
           if topic:
                result = self._getTopics(portaltypes = portaltypes , 
                                 topic = topic, noOfItems=noOfItems)
           else:
                result =  self._getItemsWithVisibility(visibilityLevel, portaltypes  = portaltypes)[:noOfItems]
        elif interfaces:
           #if there is a topic/theme tag then get items filtered 
           if topic:
                result = self._getTopics(object_provides = interfaces , 
                                 topic = topic, noOfItems=noOfItems)
           else:
                result =  self._getItemsWithVisibility(visibilityLevel, interfaces  = interfaces)[:noOfItems]
        
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
