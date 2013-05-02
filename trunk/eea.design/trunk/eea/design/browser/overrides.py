""" IEEACommonLayer specific overrides
"""

from plone.app.portlets.portlets.events import Renderer as EventsRenderer
from plone.memoize.instance import memoize
from Acquisition import aq_inner
from DateTime.DateTime import DateTime
from Products.CMFCore.utils import getToolByName
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.memoize.compress import xhtml_compress


class EEAEventsRenderer(EventsRenderer):
    """ Customized Events Renderer
    """
    
    _template = ViewPageTemplateFile('templates/events.pt')
    
    def render(self):
        """ Render
        """
        return xhtml_compress(self._template())    

    @memoize
    def _data(self):
        """ :return: catalog search for events with the minimum range of now
        """
        context = aq_inner(self.context)
        catalog = getToolByName(context, 'portal_catalog')
        limit = self.data.count
        state = self.data.state
        path = self.navigation_root_path
        # #13816 start override by passing QuickEvent to portal_type for
        # events portlet
        return catalog(portal_type=['Event', 'QuickEvent'],
                       review_state=state,
                       end={'query': DateTime(),
                            'range': 'min'},
                       path=path,
                       sort_on='start',
                       sort_limit=limit)[:limit]

    def decode_location(self, location):
        """ Return a string containing the Location 
        """
        liste = []       
        # #14394: The location tuple contains string in unicode, converting  
        # them in string decodes them.
        for item in location:
            liste.append(item)
        
        return ', '.join(liste)