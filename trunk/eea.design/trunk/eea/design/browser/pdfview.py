""" PDF View
"""
from Products.Five.browser import BrowserView
from Products.NavigationManager.browser.navigation import getApplicationRoot

class Cover(BrowserView):
    """ PDF Cover
    """
    @property
    def header(self):
        """ Cover header
        """
        doc = getApplicationRoot(self.context)
        return doc.title_or_id()
