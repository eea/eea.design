""" PDF View
"""
from zope.component import queryMultiAdapter
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
