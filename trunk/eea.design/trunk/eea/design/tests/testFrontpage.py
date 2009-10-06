# -*- coding: utf-8 -*-
#
# File: testFrontpage.py
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

import os, sys
if __name__ == '__main__':
    execfile(os.path.join(sys.path[0], 'framework.py'))

##code-section module-header #fill in your manual code here
##/code-section module-header

#
# Test-cases for class(es) Frontpage
#
from Testing import ZopeTestCase
from Products.EEAContentTypes.config import *
from Products.EEAContentTypes.tests.EEAContentTypeTestCase import EEAContentTypeTestCase

# Import the tested classes
from Products.EEAContentTypes.browser.frontpage import Frontpage
from Products.CMFCore.utils import getToolByName

##code-section module-beforeclass #fill in your manual code here
from Globals import package_home
from DateTime import DateTime
from pprint import pprint
from zope.app.event.objectevent import ObjectModifiedEvent
from zope.event import notify
from lovely.memcached.event import InvalidateCacheEvent

image = open(os.path.join(package_home(product_globals),'tests', 'image.png'),'rb')
image = image.read()
##/code-section module-beforeclass


class testFrontpage(EEAContentTypeTestCase):
    """Test-cases for class(es) Frontpage."""

    ##code-section class-header_testFrontpage #fill in your manual code here
    ##/code-section class-header_testFrontpage

    def afterSetUp(self):
        highlight = {'type': 'Highlight', 'id' : 'high%s', 'text' : 'data%s',
                     'title' : 'Foo%s',
                     'teaser' : 'teaser%s'}
        for i in range(15):
            id=highlight['id'] % i
            text = highlight['text'] % i
            title = highlight['title'] % i
            self.folder.invokeFactory('Highlight', id=id, text=text,
                                      title=title)


        self.folder.invokeFactory('Image', id='image1', image=image, title='Image title')
        self.workflow = self.portal.portal_workflow
        self.setRoles('Manager')
        portal_properties = getToolByName(self.portal, 'portal_properties')
        frontpage_properties = getattr(portal_properties, 'frontpage_properties')
        self.noOfHigh = 1
        self.noOfMedium = 4
        self.noOfLow = 10
        frontpage_properties.manage_changeProperties(noOfHigh=self.noOfHigh,noOfMedium=self.noOfMedium,noOfLow=self.noOfLow)

    # from class Frontpage:
    def test_getHigh(self):
        highlights = [ 'high%s' % i for i in range(5) ]
        for hid in highlights:
            high = getattr(self.folder, hid)
            self.workflow.doActionFor(high, 'publish')            
            high.setVisibilityLevel('top')
            high.setTeaser( 'teaser%s' % hid )
            high.reindexObject()

        self.folder.high6.setVisibilityLevel('top')
        self.folder.high6.reindexObject()

        view = Frontpage(self.portal, self.app.REQUEST)
        brains = view.getHigh()
        result = [ high['id'] for high in brains ]
        answer = highlights[:self.noOfHigh]
        message = '%s != %s' % (result, answer)
        self.failIf( result != answer, message )

        result = [ str(high['getTeaser']) for high in brains ]
        answer = [ 'teaserhigh0','teaserhigh1', 'teaserhigh2' ][:self.noOfHigh]
        message = '%s != %s' % (result, answer)
        self.failIf( result != answer, message )

        result = [ str(high['getUrl']) for high in brains ]
        answer = [ getattr(self.folder, hid).absolute_url() for hid in highlights[:self.noOfHigh] ]
        message = '%s != %s' % (result, answer)
        self.failIf( result != answer, message )

        # only display ONE top highlight
        self.portal.portal_properties.frontpage_properties.noOfHigh =  1
        # we need to invalidate cache
        notify(InvalidateCacheEvent(raw=True, dependencies=['frontpage-highlights']))
        view = Frontpage(self.portal, self.app.REQUEST)
        brains = view.getHigh()
        result = [ high['id'] for high in brains ]
        answer = highlights[:1]
        message = '%s != %s' % (result, answer)
        self.failIf( result != answer, message )

    # from class Frontpage:
    def test_getMedium(self):
        highlights = [ ('high%s' % i, 'top') for i in range(5) ]
        highlights.extend([ ('high%s' % i, 'middle') for i in range(5,10) ])
        for hid, level in highlights:
            high = getattr(self.folder, hid)
            high.setVisibilityLevel(level)
            self.workflow.doActionFor(high, 'publish')            
            high.reindexObject()
            notify(ObjectModifiedEvent(high))
            
        answer = highlights[self.noOfHigh:][:self.noOfMedium]
        view = Frontpage(self.portal, self.app.REQUEST)
        middle = view.getMedium()
        result = [ (high['id'],  high['getVisibilityLevel'] ) for high in middle ]
        message = '%s != %s' % (result, answer)
        self.failIf( result != answer, message )

        result = [ str(high['getUrl']) for high in middle ]
        answer = [ getattr(self.folder, hid).absolute_url() for hid,foo in answer ]
        message = '%s != %s' % (result, answer)
        self.failIf( result != answer, message )

        # only display ONE top highlight at top so we should get the two extra in
        # middle
        self.portal.portal_properties.frontpage_properties.noOfHigh =  1
        view = Frontpage(self.portal, self.app.REQUEST)
        middle = view.getMedium()
        result = [ (high['id'], high['getVisibilityLevel']) for high in middle ]
        answer = highlights[self.noOfHigh:][:self.noOfMedium]
        message = '%s != %s' % (result, answer)
        self.failIf( result != answer, message )

    # from class Frontpage:
    def test_getLow(self):
        highlights = [ ('high%s' % i, 'top') for i in range(5) ]
        highlights.extend([ ('high%s' % i, 'middle') for i in range(5,10) ])
        highlights.extend([ ('high%s' % i, 'bottom') for i in range(10,15) ])

        now = DateTime()
        for hid,level in highlights:
            high = getattr(self.folder, hid)
            high.setVisibilityLevel(level)
            self.workflow.doActionFor(high, 'publish')            
            high.setEffectiveDate(now)
            high.reindexObject()
            notify(ObjectModifiedEvent(high))

        view = Frontpage(self.portal, self.app.REQUEST)
        result = [ (high['id'], high['getVisibilityLevel']) for high in view.getLow() ]
        answer = highlights[self.noOfHigh+self.noOfMedium:][:10]
        message = '%s != %s' % (result, answer)
        self.failIf( result != answer, message )

        # publish two days ago
        self.folder.high2.setEffectiveDate(now-2)
        self.folder.high2.reindexObject()
        # we should get the same result since we will use the cached version of
        # getLow method
        result = [ (high['id'], high['getVisibilityLevel']) for high in view.getLow() ]
        message = '%s != %s' % (result, answer)
        self.failIf( result != answer, message )

        # we send a notify that a highlight is changed and we should get new result
        notify(ObjectModifiedEvent(self.folder.high2))        
        # add the old one to the end since it's oldest
        # we also need to remove one extra from all highlights since it's move to the end
        answer = highlights[self.noOfHigh+self.noOfMedium+1:]
        answer.append(('high2', 'top'))
        answer = answer[:10]
        result = [ (high['id'], high['getVisibilityLevel']) for high in view.getLow() ]
        message = '%s != %s' % (result, answer)
        self.failIf( result != answer, message )

        # expire yesterday
        self.folder.high2.setExpirationDate(now-1)
        self.folder.high2.reindexObject()
        notify(ObjectModifiedEvent(self.folder.high2))                
        # add the old one to the end since it's oldest
        # we also need to remove one extra from all highlights since it's move to the end
        answer = highlights[self.noOfHigh+self.noOfMedium+1:]
        answer = answer[:10]

        result = [ (high['id'], high['getVisibilityLevel']) for high in view.getLow() ]
        message = '%s != %s' % (result, answer)
        self.failIf( result != answer, message )

    # from class Frontpage:
    def test_getPromotions(self):
        self.setRoles('Manager')
        promotion = { 'type': 'Promotion', 'id' : 'promo%s', 'description' : 'desc%s',
                     'title' : 'Foo%s', 'url' : 'url%s' , 'image' : None, 'imageCaption' : 'imgC%s'}
        #promotion['imglink'] = '<a class="portletHeader hide-promo"><br class="clearAll"><a style="display: none" /><a href="%(img_url)s"><img src="%(img_url)s" /></a>'
        groups = {'edu' : 'Education',
                  'service' : 'Service' }

        answer = []

        start = end = 0
        for gId, gTitle in groups.items():
            end += 5
            self.folder.invokeFactory('Folder', id=gId, title=gTitle)
            folder = getattr(self.folder, gId)
            self.workflow.doActionFor(folder, 'publish')
            category = { 'id' : gId,
                         'Title' : gTitle,
                         'macro': 'here/portlet_promotions/macros/portlet',
                         'path' : '/%s' % folder.absolute_url(1),
                         'url' : folder.absolute_url() }
            cPromos = []

            for i in range(start, end):
                id= promotion['id'] % i
                description = promotion['description'] % i
                title = promotion['title'] % i
                url = promotion['url'] % i
                promo = {'id' : id, 'Description' : description,
                         'Title' : title, 'url' : url }
                id = folder.invokeFactory(promotion['type'], image=image, **promo)
                promoObj = getattr(folder, id)
                promoObj.setTitle(promo['Title'])
                promoObj.setDescription(promo['Description'])
                promo['image'] = promoObj.absolute_url() + '/image'
                cPromos.append(promo)
                self.workflow.doActionFor(promoObj, 'publish')
            answer.append({ 'category' : category,
                            'promotions' : cPromos})
            start = end

        self.portal.portal_properties.frontpage_properties.promotionFolder = '/'.join(self.folder.getPhysicalPath())
        view = Frontpage(self.portal, self.app.REQUEST)
        result = view.getPromotions()
        for cp in result:
            c, promos = cp.values()
            for p in promos:
                del p['style']
                del p['imglink']

        message = '%s != %s' % (result, answer)
        self.failIf(result != answer, message)

        self.portal.portal_properties.frontpage_properties.promotionFolder = '/'.join(self.folder.getPhysicalPath())[7:]
        view = Frontpage(self.portal, self.app.REQUEST)
        result = view.getPromotions()
        for cp in result:
            c, promos = cp.values()
            for p in promos:
                del p['style']
                del p['imglink']

        message = '%s != %s' % (result, answer)
        self.failIf(result != answer, message)

        # lets change a promotion and check if the cache is invalidated
        promo = self.folder['edu']['promo5']
        promo.setTitle('New title')
        promo.reindexObject()
        notify(ObjectModifiedEvent(promo))
        answer[1]['promotions'][0]['Title'] = 'New title'
        
        view = Frontpage(self.portal, self.app.REQUEST)
        result = view.getPromotions()
        for cp in result:
            c, promos = cp.values()
            for p in promos:
                del p['style']
                del p['imglink']

        
        message = '%s != %s' % (result, answer)
        self.failIf(result != answer, message)


        # lets unpublish a whole folder and see if the cache is invalidatede
        promoFolder = self.folder['edu']
        self.workflow.doActionFor(promoFolder, 'hide')
        notify(ObjectModifiedEvent(promoFolder))
        
        message = '%s != %s' % (result, answer)
        self.failIf(result != answer, message)
        

def test_suite():
    from unittest import TestSuite, makeSuite
    suite = makeSuite(testFrontpage)

    from Products.PloneTestCase import layer
    from Products.PloneTestCase import setup

    if setup.USELAYER:
        if not hasattr(suite, 'layer'):
                suite.layer = layer.PloneSite

    return  TestSuite(suite)

##code-section module-footer #fill in your manual code here
##/code-section module-footer

if __name__ == '__main__':
    framework()


