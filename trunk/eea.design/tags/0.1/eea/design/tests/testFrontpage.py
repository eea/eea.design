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

from Testing import ZopeTestCase
from Products.EEAContentTypes.config import *
from eea.design.tests.base import EEAMegaTestCase
from eea.design.browser.frontpage import Frontpage
from Products.CMFCore.utils import getToolByName
from Globals import package_home
from DateTime import DateTime
from zope.app.event.objectevent import ObjectModifiedEvent
from zope.event import notify
from lovely.memcached.event import InvalidateCacheEvent

image = open(os.path.join(package_home(product_globals),'tests', 'image.png'),'rb')
image = image.read()


class TestFrontPage(EEAMegaTestCase):
    """Test-cases for class(es) Frontpage."""

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
        frontpage_properties.manage_changeProperties(noOfHigh=self.noOfHigh,noOfMedium=self.noOfMedium)

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


def test_suite():
    from unittest import TestSuite, makeSuite
    suite = makeSuite(TestFrontPage)
    return  TestSuite(suite)

if __name__ == '__main__':
    framework()
