""" PDF View
"""
import os
import urllib2, urlparse
import contextlib
from bs4 import BeautifulSoup
from DateTime import DateTime
from zope.component.hooks import getSite
from zope.component import queryMultiAdapter
from Products.NavigationManager.browser.navigation import getApplicationRoot
from eea.converter.browser.app.pdfview import Cover as PDFCover
from eea.converter.browser.app.pdfview import Body as PDFBody
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
    """ Custom PDF cover
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

class Body(PDFBody):
    """ Custom PDF body
    """

    def fix_daviz(self, html):
        """ Replace daviz iframes with fallback images
        """
        soup = BeautifulSoup(html)
        for iframe in soup.find_all('iframe'):
            src = iframe.get('src')
            if u'embed-chart' in src:
                src = src.replace('embed-chart', 'embed-chart.png')
                base = src.split('embed-chart.png')[0]
                query = urlparse.parse_qs(urlparse.urlparse(src).query)
                chart = query.get('chart')[0]
            elif u'embed-dashboard' in src:
                src = src.replace('embed-dashboard', 'embed-dashboard.png')
                base = src.split('embed-dashboard.png')[0]
                query = urlparse.parse_qs(urlparse.urlparse(src).query)
                chart = query.get('dashboard')[0]
            else:
                continue

            src += '&tag:int=1&safe:int=0'

            if not src.startswith('http'):
                src = os.path.join(self.context.absolute_url(), src)
            if not base.startswith('http'):
                base = os.path.join(self.context.absolute_url(), base)

            code = ''
            with contextlib.closing(
                urllib2.urlopen(src, timeout=15)) as conn:
                code = conn.read()

            if code:
                img = BeautifulSoup(code)
            else:
                chart_url = u'%s#tab-%s' % (base, chart)
                qr_url = (
                    u"http://chart.apis.google.com"
                    "/chart?cht=qr&chld=H|0&chs=%sx%s&chl=%s" % (
                        70, 70, urllib2.quote(chart_url)))
                img = BeautifulSoup(u'''
                <div class="portalMessage warningMessage pdfMissingImage">
                  <img class="qr" src="%(qr_url)s" />
                  <span>
                    This area contains interactive content
                    which is not printable.
                    You may visit the online version at:
                  </span>
                  <a href="%(url)s">%(url)s</a>
                </div>''' % {'url': chart_url, 'qr_url': qr_url})
            iframe.replaceWith(img)
        return soup.decode()

    def __call__(self, **kwargs):
        html = super(Body, self).__call__(**kwargs)
        html = self.fix_daviz(html)
        return html
