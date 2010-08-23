from eea.design.tests.base import EEAMegaTestCase

class TestPageBackground(EEAMegaTestCase):
    """Test-cases for class(es) Frontpage."""

    def afterSetUp(self):
        self.setRoles(['Manager'])
        self.testPage = self.portal[self.portal.invokeFactory('Document', id='test')]

    def test_setBackground(self):
        context = self.testPage
        view = context.restrictedTraverse('@@page_background')
        self.failUnless(view.getBackgroundURL() == None)
        url = 'http://www.eea.europa.eu/themes/water/waves.gif'
        view.setBackgroundURL(url)
        self.failUnless(view.getBackground() == url)

def test_suite():
    from unittest import TestSuite, makeSuite
    suite = makeSuite(TestPageBackground)
    return  TestSuite(suite)
