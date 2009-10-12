from Testing import ZopeTestCase
from Products.PloneTestCase import PloneTestCase
from Products.PloneTestCase.layer import onsetup
from Products.Five import zcml
from Products.Five import fiveconfigure
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone.interfaces import IPloneSiteRoot
from Products.GenericSetup import EXTENSION, profile_registry
from eea.design.tests.layer import MigrationLayer
from eea.testcase.base import EEAMegaTestCase
from Products.CMFPlone.interfaces import ITestCasePloneSiteRoot


PROFILES = ['eea.design:default']

profile_registry.registerProfile(
                    'testfixture',
                    'test:EEAContentTypes',
                    'Extension profile for testing EEAContentTypes',
                    'profile/testfixture',
                    'EEAContentTypes',
                    EXTENSION,
                    for_=ITestCasePloneSiteRoot)

class FunctionalTestCase(PloneTestCase.FunctionalTestCase):
    pass

class MigrationTestCase(FunctionalTestCase):
    layer = MigrationLayer

