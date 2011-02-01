from Products.PloneTestCase import PloneTestCase
from Products.GenericSetup import EXTENSION, profile_registry
from eea.testcase.base import EEAMegaTestCase
from Products.CMFPlone.interfaces import ITestCasePloneSiteRoot

profile_registry.registerProfile(
                    'testfixture',
                    'test:EEAContentTypes',
                    'Extension profile for testing EEAContentTypes',
                    'profile/testfixture',
                    'EEAContentTypes',
                    EXTENSION,
                    for_=ITestCasePloneSiteRoot)

from Products.PloneTestCase.layer import onsetup
from Products.Five import zcml
from Products.Five import fiveconfigure

PRODUCTS = ['PloneLanguageTool', 'LinguaPlone']
@onsetup
def setup_eea_design():
    """Set up the additional products.

    The @onsetup decorator causes the execution of this body to be deferred
    until the setup of the Plone site testing layer.
    """
    fiveconfigure.debug_mode = True
    import Products.Five
    zcml.load_config('meta.zcml', Products.Five)

    import eea.design
    zcml.load_config('configure.zcml', eea.design)
    fiveconfigure.debug_mode = False

    PloneTestCase.installProduct('Five')

    # XXX Plone 2.x compatible
    try: import Products.FiveSite
    except ImportError: pass
    else: PloneTestCase.installProduct('FiveSite')

    for product in PRODUCTS:
        PloneTestCase.installProduct(product)

setup_eea_design()
PloneTestCase.setupPloneSite(
    products=PRODUCTS,
    extension_profiles=(
        'eea.design:default',
    ))

class MigrationTestCase(PloneTestCase.FunctionalTestCase):
    """ Functional Test Case """
