""" Controllers
"""
from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from Acquisition import aq_base, aq_inner, aq_parent
from Products.CMFPlone import utils as putils

class Main(BrowserView):
    """ Main View
    """
    def _getRoot(self):
        """ Return the root of our application. """
        if not putils.base_hasattr(self, '_root'):
            portal_url = getToolByName(self.context, 'portal_url')
            portal = portal_url.getPortalObject()
            obj = self.context
            while aq_base(obj) is not aq_base(portal):
                obj =  aq_parent(aq_inner(obj))
            self._root = [obj]
        return self._root[0]

    def inApplication(self):
        """ Application?
        """
        root = self._getRoot()
        portal_url = getToolByName(self.context, 'portal_url')
        portal = portal_url.getPortalObject()
        return root != aq_base(portal)
