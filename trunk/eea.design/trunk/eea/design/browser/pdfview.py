""" PDF View
"""
from DateTime import DateTime
from zope.component.hooks import getSite
from zope.component import queryMultiAdapter
from Products.NavigationManager.browser.navigation import getApplicationRoot
from eea.converter.browser.app.pdfview import Cover as PDFCover
from eea.converter.pdf.adapters import OptionsMaker as PDFOptionsMaker

class OptionsMaker(PDFOptionsMaker):
    """ Custom PDF options maker for EEA ctypes
    """
    def __init__(self, context):
        super(OptionsMaker, self).__init__(context)
        self._header = None
        self._footer = None

    @property
    def header(self):
        """ Safely get pdf.header
        """
        if not self._header:
            self._header = getSite().absolute_url() + '/pdf.header'
        return self._header

    @property
    def footer(self):
        """ Safely get pdf.footer
        """
        if not self._footer:
            self._footer = getSite().absolute_url() + '/pdf.footer'
        return self._footer

    def getOptions(self):
        """ Custom options
        """
        options = super(OptionsMaker, self).getOptions()
        options['page-offset'] = '3'
        return options

class Cover(PDFCover):
    """ PDF Cover
    """

    @property
    def year(self):
        """ Publication year
        """
        published = DateTime(self.context.Date())
        return published.year()

    @property
    def header(self):
        """ Cover header
        """
        doc = getApplicationRoot(self.context)
        return doc.title_or_id()

    @property
    def themes(self):
        """ Get object themes
        """
        themes = queryMultiAdapter((self.context, self.request),
                                   name='themes-object')

        for theme in themes.items():
            theme = themes.item_to_short_dict(theme)
            image = theme.get('image', None)
            if not image:
                continue
            theme['image'] = image.replace('/image_icon', '/image_preview')
            yield theme
