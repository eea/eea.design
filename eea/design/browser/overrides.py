""" IEEACommonLayer specific overrides
"""
from urllib import urlencode
from plone.app.portlets.portlets.events import Renderer as EventsRenderer
from plone.memoize.instance import memoize
from plone.memoize.compress import xhtml_compress
from Acquisition import aq_inner
from DateTime.DateTime import DateTime
from Products.CMFCore.utils import getToolByName
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
has_workflowmanager = True
try:
    from plone.app.workflowmanager.browser.workflow import Assign
except ImportError:
    has_workflowmanager = False


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
        l_list = []
        # #14394: The location tuple contains string in unicode, converting
        # them in string decodes them.
        for item in location:
            l_list.append(item)
        return ', '.join(l_list)


if has_workflowmanager:
    class EEAAssign(Assign):
        """ Override for plone.app.workflowmanager workflow assign """

        def __call__(self):
            self.errors = {}

            if self.request.get('form.actions.next', False):
                self.authorize()
                params = urlencode({'type_id': self.request.get('type_id'),
                    'new_workflow': self.selected_workflow.id})
                return self.handle_response(load=self.context_state.portal_url() +
                    '/@@types-controlpanel?' + params)
            else:
                return self.handle_response(tmpl=self.template)
