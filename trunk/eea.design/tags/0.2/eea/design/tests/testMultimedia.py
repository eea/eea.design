import os, sys
if __name__ == '__main__':
    execfile(os.path.join(sys.path[0], 'framework.py'))

from zope.interface import alsoProvides
from Globals import package_home
from DateTime import DateTime
from OFS.Image import Image
from Products.EEAContentTypes.content.interfaces import IFlashAnimation
from p4a.video.interfaces import IVideoEnhanced
from p4a.video.interfaces import IVideo
from eea.design.tests.base import EEAMegaTestCase
from eea.design.browser.frontpage import Frontpage


image = open(os.path.join(package_home(globals()), 'image.png'), 'rb')
image = image.read()


class TestMultimedia(EEAMegaTestCase):

    def afterSetUp(self):
        self.setRoles('Manager')
        now = DateTime()
        for i in range(0, 5):
            vid = self.folder[self.folder.invokeFactory('File', id='vid%i' % i)]
            alsoProvides(vid, IVideoEnhanced)
            vid.setTitle('Vid %i' % i)

            vid.setEffectiveDate(now-i)

            # Upload a thumbnail to the video
            img = Image('foobar', 'Foobar', image)
            p4vid = IVideo(vid)
            p4vid.video_image = img

            vid.reindexObject()
            self.portal.portal_workflow.doActionFor(vid, 'publish')

        # Flash animations should be filtered out
        swf = self.folder[self.folder.invokeFactory('File', id='swf')]
        swf.setTitle('swf object (sort me out)')
        alsoProvides(swf, IVideoEnhanced)
        alsoProvides(swf, IFlashAnimation)
        swf.setEffectiveDate(now)
        swf.reindexObject()
        self.portal.portal_workflow.doActionFor(swf, 'publish')

        view = Frontpage(self.portal, self.app.REQUEST)
        self.result = view.getMultimedia()

    def test_length(self):
        """Should only return 4 vids"""
        n = len(self.result)
        self.failIf(n != 4, n)

    def test_order(self):
        """Sort on effective date, newest first"""
        titles = [i['title'] for i in self.result]
        expected_titles = ['Vid 0', 'Vid 1', 'Vid 2', 'Vid 3']
        self.failIf(titles != expected_titles, titles)

    def test_sizes(self):
        """Image links should be widescreen"""
        imglinks = [i['imglink'] for i in self.result]
        for i in imglinks:
            self.failIf('image_wide' not in i, i)


def test_suite():
    from unittest import TestSuite, makeSuite
    suite = makeSuite(TestMultimedia)
    return  TestSuite(suite)

if __name__ == '__main__':
    framework()
