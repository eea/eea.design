""" Batching
"""
from Products.Five.browser import BrowserView
from DateTime import DateTime
from ZODB.POSException import ConflictError
from AccessControl import Unauthorized


class Batching(BrowserView):
    """ Batching
    """

    batch = None

    def __call__(self, batch):
        self.batch = batch
        return self.index()

class FormatCatalogMetadata(BrowserView):
    """ Determine whether the input is a DateTime or ISO date and localize
    it if so, also convert lists and dicts into reasonable strings.
    """

    def __call__(self, value, long_format=True):

        if value is None:
            return ''

        if isinstance(value, DateTime):
            return self.context.toLocalizedTime(
                value.ISO8601(), long_format = long_format)

        # Ugly but fast check for ISO format (ensure we have '-'
        # and positions 4 and 7,
        #  ' ' at positiion 10 and ':' and 13 and 16), then
        # convert just in case.
        if isinstance(value, basestring) and value[4:-1:3] == '-- ::':
            try:
                DateTime(value)
            except ConflictError:
                raise
            except:
                # Bare excepts are ugly, but DateTime raises a
                # whole bunch of different
                # errors for bad input (Syntax, Time, Date, Index, etc.),
                # best to be safe.
                return value
            return self.context.toLocalizedTime(
                value, long_format = long_format)

        try:
            # Missing.Value and others have items()
            # but don't have security assertions
            # to support accessing it.
            items = getattr(value, 'items', None)
        except Unauthorized:
            items = None

        if items is not None and callable(items):
            # For dictionaries return a string of the form
            # 'key1: value1, key2: value2'
            value = ', '.join('%s: %s' % (a, b) for a, b in items())
        if isinstance(value, (list, tuple)):
            # Return list as comma separated values
            alist = []
            for item in value:
                if isinstance(item, basestring):
                    alist.append(item)
                else:
                    alist.append(str(item))
            value = ', '.join(alist)

        if not isinstance(value, basestring):
            value = unicode(value)

        pt = self.context.portal_properties
        site_props = getattr(pt, 'site_properties', None)
        if site_props is not None:
            max_length = site_props.getProperty(
                'search_results_description_length', 160  )
            ellipsis = site_props.getProperty('ellipsis', '...' )
        else:
            max_length = 160
            ellipsis = '...'
        if len(value) < max_length:
            return value
        else:
            return '%s%s' % (value[:max_length], ellipsis)
