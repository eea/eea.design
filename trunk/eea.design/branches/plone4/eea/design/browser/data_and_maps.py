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
        
        self.noOfDatasets = frontpage_properties.getProperty('noOfDatasets', 6)
        self.noOfEachProduct = frontpage_properties.getProperty('noOfEachProduct', 3)
        self.now = DateTime()
        
    def getLatestDatasets(self):
        """ """
        portaltypes = ('Data',)
        visibilityLevel = ''
        result = []
        #if topic is not passed in the REQUEST variable
        #then we try to get it from the context
        topic = getattr( self.context.REQUEST, 'topic', None)       
        topic_request = getTheme(self.context)
        if topic or topic_request:
            topic = [topic if topic else topic_request].pop()
            
        for mytype in portaltypes:
            if topic:
                result2 = self._getTopics(portaltypes = mytype , 
                                 topic = topic, noOfItems=self.noOfDatasets)
            else:
                result2 =  self._getItemsWithVisibility(visibilityLevel, portaltypes  = mytype)[:self.noOfDatasets]
            result.extend(result2)
            
        return result
        
    def getLatestIndicators(self):
        """ """
        pass
        
    def getLatestMaps(self):
        """ """
        pass
    
        
    def getLatestGraphs(self):
        """ """
        pass
        
    def getLatestInteractiveMaps(self):
        """ """
        pass
    
    def getLatestInteractiveData(self):
        """ """
        pass
    

    def getAllProducts(self):
        """ get all latest published products for frontpage """
        portaltypes = ('Report','Article','Highlight','PressRelease', 'Assessment', 'Data', 'EEAFigure')
        interfaces = 'p4a.video.interfaces.IVideoEnhanced'
        visibilityLevel = ''
        topic = getattr( self.context.REQUEST, 'topic', None)
        topic_request = 'themes' in self.context.REQUEST['URL0']
        if topic_request:
            topic = getTheme(self.context) 
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
