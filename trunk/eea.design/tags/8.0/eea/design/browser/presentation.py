""" Presentation
"""
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
            * convert p to div (s5_slides.css hides p elements)
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
                elif elem.name == 'p':
                    elem.name = 'div'
            except AttributeError:
                pass
            if isinstance(elem, NavigableString) and not elem.strip():
                continue
            out.append(elem.prettify())
        out = BeautifulSoup(''.join(out))
        return out.body.decode_contents(formatter='html')
