from Products.PloneTestCase import PloneTestCase
from Products.PloneTestCase.layer import onsetup
from Products.Five import zcml
from Products.Five import fiveconfigure
from Products.CMFPlone.interfaces import IPloneSiteRoot
from Products.GenericSetup import EXTENSION, profile_registry
from eea.design.tests.layer import MigrationLayer


PRODUCTS = ['ATVocabularyManager', 'FiveSite']
PROFILES = ['eea.design:default']


@onsetup
def setup_eea_design():
    fiveconfigure.debug_mode = True
    import Products.Five
    import Products.FiveSite
    import eea.design
    zcml.load_config('meta.zcml', Products.Five)
    zcml.load_config('configure.zcml', Products.Five)
    zcml.load_config('configure.zcml', Products.FiveSite)
    zcml.load_config('configure.zcml', eea.design)
    fiveconfigure.debug_mode = False

    PloneTestCase.installProduct('Five')
    for product in PRODUCTS:
        PloneTestCase.installProduct(product)

setup_eea_design()
PloneTestCase.setupPloneSite()


class FunctionalTestCase(PloneTestCase.FunctionalTestCase):
    pass

class MigrationTestCase(FunctionalTestCase):
    layer = MigrationLayer
