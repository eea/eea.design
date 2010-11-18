""" Tag cloud browser views
"""
import logging
from zope.component import queryAdapter
from Products.Five.browser import BrowserView
from eea.facetednavigation.interfaces import ICriteria

logger = logging.getLogger('eea.design.browser.tagcloud')

class TagCloud(BrowserView):
    """ Tag cloud based on eea.facetednavigation TagsClud Widget
    """
    def __call__(self, ancestor, **kwargs):
        criteria = queryAdapter(ancestor, ICriteria)
        if not criteria:
            logger.exception('Invalid ancestor %r', ancestor)
            return ''

        cid = ''
        for cid, criterion in criteria.items():
            if criterion.get('widget', '') == 'tagscloud':
                break

        if not cid:
            logger.exception('Provided ancestor %r has no tagscloud facet',
                             ancestor)
            return ''

        widget = criteria.widget(cid=cid)
        widget = widget(ancestor, self.request, criterion)
        return widget()
