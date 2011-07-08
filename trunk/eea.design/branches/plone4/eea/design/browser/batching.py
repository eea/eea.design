from Products.Five.browser import BrowserView
from Products.CMFCore.utils import getToolByName
from Acquisition import aq_base, aq_inner, aq_parent
from Products.CMFPlone import utils as putils

class Batching(BrowserView):
    """
    """

    batch = None

    def __call__(self, batch):
        self.batch = batch
        return self.index()

