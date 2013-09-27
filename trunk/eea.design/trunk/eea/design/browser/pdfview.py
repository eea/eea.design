""" PDF View
"""
from Products.Five.browser import BrowserView
from Products.NavigationManager.browser.navigation import getApplicationRoot
from eea.converter.browser.app.pdfview import Cover as PDFCover

class Cover(PDFCover):
    """ PDF Cover
    """
    @property
    def header(self):
        """ Cover header
        """
        doc = getApplicationRoot(self.context)
        return doc.title_or_id()
