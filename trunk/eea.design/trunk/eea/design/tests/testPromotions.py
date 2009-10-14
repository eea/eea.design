import os, sys
if __name__ == '__main__':
    execfile(os.path.join(sys.path[0], 'framework.py'))

from zope.interface import alsoProvides
from Testing import ZopeTestCase
from Products.EEAContentTypes.config import *
from eea.design.tests.base import EEAMegaTestCase
from eea.design.browser.frontpage import Frontpage
from eea.themecentre.interfaces import IThemeCentre, IThemeCentreSchema
from eea.promotion.interfaces import IPromotable, IPromotion
from p4a.video.interfaces import IVideoEnhanced
from Products.CMFCore.utils import getToolByName
from Globals import package_home
from DateTime import DateTime
from pprint import pprint
from zope.app.event.objectevent import ObjectModifiedEvent
from zope.event import notify
from lovely.memcached.event import InvalidateCacheEvent

image = open(os.path.join(package_home(product_globals),'tests', 'image.png'),'rb')
image = image.read()


class TestPromotions(EEAMegaTestCase):

    def afterSetUp(self):
        self.setRoles('Manager')

        template = {
            'type': 'Promotion',
            'id': 'promo%s',
            'description' : 'desc%s',
            'title': 'Foo%s',
            'url': 'url%s',
            'image': None,
            'imageCaption': 'imgC%s',
        }

        themes = [
            ('agriculture', 'Agriculture'),
            ('air', 'Air pollution'),
            ('biodiversity', 'Biodiversity'),
            ('chemicals', 'Chemicals'),
            ('climate', 'Climate'),
            ('energy', 'Energy'),
        ]

        now = DateTime()
        category_i = 0
        for id, title in themes:
            category_i += 1
            self.folder.invokeFactory('Folder', id=id, title=title)
            folder = getattr(self.folder, id)
            self.portal.portal_workflow.doActionFor(folder, 'publish')

            alsoProvides(folder, IThemeCentre)
            alsoProvides(folder, IThemeCentreSchema)
            IThemeCentreSchema(folder).tags = id
            folder.reindexObject()

            category = {
                'id': id,
                'Title': title,
                'macro': 'here/portlet_promotions/macros/portlet',
                'path': '/%s' % folder.absolute_url(1),
                'url': folder.absolute_url(),
            }

            promotions = []
            for i in range(0, 2):
                info = {
                    'id': template['id'] % i,
                    'Description': template['description'] % i,
                    'Title': template['title'] % i,
                    'url': template['url'] % i,
                }

                id = folder.invokeFactory(template['type'], image=image, **info)
                promoObj = getattr(folder, id)
                promoObj.setTitle(info['Title'])
                promoObj.setDescription(info['Description'])
                promoObj.setEffectiveDate(now-1-category_i-i)
                self.portal.portal_workflow.doActionFor(promoObj, 'publish')

    def test_getPromotions(self):
        view = Frontpage(self.portal, self.app.REQUEST)
        result = view.getPromotions()

        result_categories = [i['category']['Title'] for i in result]
        result_promotions = [i['promotions'][0]['Title'] for i in result]

        expected_categories = ['Agriculture', 'Air pollution', 'Biodiversity', 'Chemicals', 'Climate']
        expected_promotions = ['Foo0', 'Foo0', 'Foo0', 'Foo0', 'Foo0']

        self.failIf(expected_categories != result_categories, result_categories)
        self.failIf(expected_promotions != result_promotions, result_promotions)

    def test_internalPromotions(self):
        folder = self.folder['energy']
        internal_promo = folder[folder.invokeFactory('News Item', id='internal_promo')]
        now = DateTime()
        internal_promo.setEffectiveDate(now)
        internal_promo.setTitle('Internal Promotion')
        alsoProvides(internal_promo, IPromotable)
        internal_promo.restrictedTraverse("@@createPromotion")()
        IPromotion(internal_promo).locations = [u'Front Page']
        self.portal.portal_workflow.doActionFor(internal_promo, 'publish')

        view = Frontpage(self.portal, self.app.REQUEST)
        result = view.getPromotions()

        result_categories = [i['category']['Title'] for i in result]
        result_promotions = [i['promotions'][0]['Title'] for i in result]

        expected_categories = ['Agriculture', 'Air pollution', 'Biodiversity', 'Chemicals', 'Energy']
        expected_promotions = ['Foo0', 'Foo0', 'Foo0', 'Foo0', 'Internal Promotion']

    def test_filter_videos(self):
        """Videos should be filtered out to not conflict with frontpage multimedia area"""
        vid = self.folder[self.folder.invokeFactory('File', id='video')]
        vid.setTitle('Vid (filter me out plz)')
        alsoProvides(vid, IVideoEnhanced)
        alsoProvides(vid, IPromotable)

        now = DateTime()
        vid.setEffectiveDate(now)

        vid.restrictedTraverse("@@createPromotion")()
        IPromotion(vid).locations = [u'Front Page']
        self.portal.portal_workflow.doActionFor(vid, 'publish')

        view = Frontpage(self.portal, self.app.REQUEST)
        result = view.getPromotions()

        result_promotions = [i['promotions'][0]['Title'] for i in result]
        expected_promotions = ['Foo0', 'Foo0', 'Foo0', 'Foo0', 'Foo0']


def test_suite():
    from unittest import TestSuite, makeSuite
    suite = makeSuite(TestPromotions)
    return  TestSuite(suite)

if __name__ == '__main__':
    framework()
