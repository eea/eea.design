from plone.app.portlets.portlets.events import Renderer as EventsRenderer
from plone.memoize.instance import memoize
from Acquisition import aq_inner
from DateTime.DateTime import DateTime
from Products.CMFCore.utils import getToolByName


class EEAEventsRenderer(EventsRenderer):

    @memoize
    def _data(self):
        context = aq_inner(self.context)
        catalog = getToolByName(context, 'portal_catalog')
        limit = self.data.count
        state = self.data.state
        path = self.navigation_root_path
        # #13816 start override by passing QuickEvent to portal_type for
        # events portlet ata
        return catalog(portal_type=['Event', 'QuickEvent'],
                       review_state=state,
                       end={'query': DateTime(),
                            'range': 'min'},
                       path=path,
                       sort_on='start',
                       sort_limit=limit)[:limit]


