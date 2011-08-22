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

from Acquisition import aq_inner
from DateTime import DateTime
from Products.CMFCore.utils import getToolByName

from Products.Five import BrowserView

from eea.design.browser.frontpage import _getItems

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
        interfaces = ('eea.dataservice.interfaces.IDataset')
        return _getItems(self, interfaces = interfaces, noOfItems = self.noOfLatestDefault)

    def getLatestIndicators(self):
        """ Get latest published indicators. """
        interfaces = ('eea.indicators.content.interfaces.IIndicatorAssessment')
        return _getItems(self, interfaces = interfaces, noOfItems = self.noOfLatestDefault)

    def getLatestMaps(self):
        """ Get latest published static maps. """
        interfaces = ('eea.dataservice.interfaces.IEEAFigureMap')
        return _getItems(self, interfaces = interfaces, noOfItems = self.noOfLatestDefault)

    def getLatestGraphs(self):
        """ Get latest published static graphs/charts."""
        interfaces = ('eea.dataservice.interfaces.IEEAFigureGraph')
        return _getItems(self, interfaces = interfaces, noOfItems = self.noOfLatestDefault)

    def getLatestInteractiveMaps(self):
        """ Get latest published interactive maps."""
        interfaces = ('Products.EEAContentTypes.content.interfaces.IInteractiveMap')
        return _getItems(self, interfaces = interfaces, noOfItems = self.noOfLatestDefault)

    def getLatestInteractiveData(self):
        """ Get latest published interactive data charts."""
        interfaces = ('Products.EEAContentTypes.content.interfaces.IInteractiveData')
        return _getItems(self, interfaces = interfaces, noOfItems = self.noOfLatestDefault)


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

