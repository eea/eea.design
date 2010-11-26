from Products.CMFCore.utils import getToolByName
import transaction


PROFILE = 'eea.design:default'
PRODUCT_DEPENDENCIES = ['eea.jquery']


def install(self, reinstall=False):
    qi = getToolByName(self, 'portal_quickinstaller')
    for i in PRODUCT_DEPENDENCIES:
        if reinstall and qi.isProductInstalled(i):
            qi.reinstallProducts([i])
            transaction.savepoint()
        elif not qi.isProductInstalled(i):
            qi.installProduct(i)
            transaction.savepoint()
    portal_setup = getToolByName(self, 'portal_setup')
    portal_setup.setImportContext('profile-%s' % PROFILE)
    portal_setup.runAllImportSteps()
    product_name = PROFILE.split(':')[0]
    qi.notifyInstalled(product_name)
