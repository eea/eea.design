from Testing import ZopeTestCase
from Products.Five import zcml
from Products.Five import fiveconfigure
from Products.CMFCore.utils import getToolByName
from Products.PloneTestCase.layer import PloneSite
from transaction import commit


class MigrationLayer(PloneSite):

    @classmethod
    def setUp(cls):
        root = ZopeTestCase.app()
        portal = root.plone
        profile = 'profile-eea.design:test_migration'
        tool = getToolByName(portal, 'portal_setup')
        tool.setImportContext(profile)
        tool.runAllImportSteps()
        # make sure it's loaded...
        css = getToolByName(portal, 'portal_css')
        assert 'eea-highlights.css' in css.getResourceIds()
        assert 'portlet.css' in css.getResourceIds()
        # and commit the changes
        commit()
        ZopeTestCase.close(root)

    @classmethod
    def tearDown(cls):
        pass
