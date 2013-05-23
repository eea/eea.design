""" Sunburst View Customizations
"""
from zope.component import getMultiAdapter

from Acquisition import aq_inner
from plonetheme.sunburst.browser.sunburstview import SunburstView

class EEASunburstView(SunburstView):
    """ EEA versions of SunburstView without left column
    """

    def getColumnsClass(self, view=None):
        """ EEA customisation to show only right column,
        Determine whether a column should be shown.
        the right column is called plone.rightcolumn.
        """
        context = aq_inner(self.context)
        plone_view = getMultiAdapter((context, self.request), name=u'plone')
        sr = plone_view.have_portlets('plone.rightcolumn', view=view)
        portal_state = getMultiAdapter((context, self.request),
                                            name=u'plone_portal_state')

        if not sr:
            # we don't have columns, thus conten takes the whole width
            return "cell width-full position-0"
        elif sr and (portal_state.is_rtl()):
            # We have right column and we are in RTL language
            return "cell width-3:4 position-0"
        elif sr  and (not portal_state.is_rtl()):
            # We have right column and we are NOT in RTL language
            return "cell width-3:4 position-0"
        elif sr and (portal_state.is_rtl()):
            # We have right column and we are in RTL language
            return "cell width-3:4 position-0"
