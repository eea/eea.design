""" Tests
"""

from Products.Five import fiveconfigure
from Products.PloneTestCase import PloneTestCase as ptc
from Products.PloneTestCase.layer import PloneSite
from Testing import ZopeTestCase as ztc
#from gocept.selenium.zope2 import Layer
#from gocept.selenium.plone import TestCase as SeleniumTestCase
import eea.design

ptc.setupPloneSite()

class TestCase(ptc.PloneTestCase):
    """ Test Case
    """
    class layer(PloneSite):
        """ Test layer
        """
        @classmethod
        def setUp(cls):
            """ Setup
            """
            fiveconfigure.debug_mode = True
            ztc.installPackage(eea.design)
            fiveconfigure.debug_mode = False

        @classmethod
        def tearDown(cls):
            """ Tear down
            """
            pass

    def testOpen(self):
        """simple demo test
        """
        pass
        #self.selenium.open('plone')
        #assert 'Plone' in self.selenium.getBodyText()

    #layer = Layer(layer)
