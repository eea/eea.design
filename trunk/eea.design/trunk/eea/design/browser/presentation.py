""" Presentation
"""
from Products.CMFCore.utils import getToolByName
from bs4 import BeautifulSoup
from bs4.element import NavigableString
from plone.app.layout.presentation.presentation import PresentationView


class EEAPresentationView(PresentationView):
    """ Customised presentation view
    """
    def content(self):
        """ Presentation slides (format body for presentation)
            * convert h1 and h2 to h1
            * arrange content in slides
            * convert img or iframe containing p tags to div
            * filter out paragraphs that have no classes
        """
        soup = BeautifulSoup(self.body())
        out = []
        first = True
        for elem in soup.body.contents:
            try:
                if elem.name in ['h1', 'h2']:
                    if not first:
                        out.append('</div>')
                    out.append('<div class="slide">')
                    elem.name = 'h1'
                    text = elem.text
                    elem.clear()
                    elem.append(text)
                    first = False
                elif elem.name == 'p' and \
                        (elem.find('iframe') or elem.find('img')):
                    elem.name = 'div'
                elif elem.name == 'p' and not elem.has_attr('class'):
                    continue
            except AttributeError:
                pass
            if isinstance(elem, NavigableString) and not elem.strip():
                continue
            out.append(elem.prettify())

        out = BeautifulSoup(''.join(out))

        final_html = []
        slides = out.find_all('div', class_='slide')
        for slide in slides:
            visible_content = []
            for elem in slide.contents:
                name = getattr(elem, 'name', None)
                if name and name not in ['h1']:
                    visible_content.append(elem)
            if visible_content:
                html = slide.decode(formatter='html')
                final_html.append(html)
        return ''.join(final_html)

    def can_show_help_message(self):
        """ Check permission before displaying help text within presentation
        """
        mtool = getToolByName(self.context, "portal_membership")
        return mtool.checkPermission('eea.daviz: Add presentation',
                                     self.context)
