from Testing.ZopeTestCase import app, close, installProduct
from Products.Five import zcml
from Products.Five import fiveconfigure
from Products.CMFCore.utils import getToolByName
from Products.PloneTestCase.layer import PloneSite
from transaction import commit



class MigrationLayer(PloneSite):
    """ layer for integration tests with LinguaPlone """

    @classmethod
    def setUp(cls):
        root = app()
        portal = root.plone
        profile = 'profile-eea.design:test_migration'
        tool = getToolByName(portal, 'portal_setup')
        tool.setImportContext(profile)
        tool.runAllImportSteps()
        # make sure it's loaded...
        css = getToolByName(portal, 'portal_css')
        assert 'eea-highlights.css' in css.getResourceIds()
        # and commit the changes
        commit()
        close(root)

    @classmethod
    def tearDown(cls):
        pass
