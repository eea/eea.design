""" Presentation
"""
from Products.CMFCore.utils import getToolByName
from bs4 import BeautifulSoup
from bs4.element import NavigableString
from plone.app.layout.presentation.presentation import PresentationView
from plone.memoize.view import memoize


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
                tag_name = elem.name
                if tag_name in ['h1', 'h2']:
                    if not first:
                        out.append('</div>')
                    out.append('<div class="slide">')
                    elem.name = 'h1'
                    text = elem.text
                    elem.clear()
                    elem.append(text)
                    first = False
                elif tag_name == 'p' and \
                        (elem.find('iframe') or elem.find('img')):
                    elem.name = 'div'
                    if not elem.has_attr('class'):
                        elem.attrs['class'] = "centered"
                    else:
                        elem.attrs['class'] += " centered"

                elif tag_name == 'p' and not elem.has_attr('class'):
                    if not elem.find('span', 'markPresentationalText'):
                        continue
            except AttributeError:
                pass
            if isinstance(elem, NavigableString) and not elem.strip():
                continue
            out.append(elem.prettify())

        out = BeautifulSoup(''.join(out))

        final_html = []
        slides = out.find_all('div', 'slide') # slide is the matching class
        for slide in slides:
            visible_content = []
            for elem in slide.contents:
                name = getattr(elem, 'name', None)
                if name and name not in ['h1']:
                    visible_content.append(elem)
            if visible_content or self.can_show_help_message():
                html = slide.decode(formatter='html')
                final_html.append(html)
        return ''.join(final_html)

    @memoize
    def can_show_help_message(self):
        """ Check permission before displaying help text within presentation
        """
        mtool = getToolByName(self.context, "portal_membership")
        return mtool.checkPermission('eea.daviz: Add presentation',
                                     self.context)

    def default_empty_slide_help_text(self):
        """ Returned default error
        """
        ptool = getToolByName(self.context, "portal_properties")
        default_text = ptool.site_properties.getProperty(
            'empty_slide_help_text', False)
        return default_text
