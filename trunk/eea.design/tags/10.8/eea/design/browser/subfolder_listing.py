""" SubfolderListing BrowserViews
"""
from Products.Five.browser import BrowserView
from zope.interface import alsoProvides, noLongerProvides
from eea.design.browser.interfaces import ISubFoldersListing
from Products.statusmessages.interfaces import IStatusMessage
from eea.design import EEANOTRANSLATIONMessageFactory as _

class SubfolderListing(BrowserView):
    """  SubfolderListing BrowserView responsible for enabling the rendering
    of the subfolder viewlet
    """

    def __init__(self, context, request):
        self.context = context
        self.request = request

    def _redirect(self, msg=''):
        """ Redirect
        """
        if self.request:
            if msg:
                IStatusMessage(self.request).addStatusMessage(msg, type='info')
            self.request.response.redirect(self.context.absolute_url())
        return msg

    def enable(self):
        """ Enable subfolder viewlet by providing ISubFoldersListing interface
        """
        translations = self.context.getTranslations()
        for trans in translations.values():
            alsoProvides(trans[0], ISubFoldersListing)
            trans[0].reindexObject(idxs='object_provides')
        self._redirect(_('SubfolderListing enabled'))

    def disable(self):
        """ Disable subfolder viewlet by noLongerProviding ISubFoldersListing 
        interface
        """
        translations = self.context.getTranslations()
        for trans in translations.values():
            noLongerProvides(trans[0], ISubFoldersListing)
            trans[0].reindexObject(idxs='object_provides')
        self._redirect(_('SubfolderListing disabled'))

