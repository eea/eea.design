""" Async Jobs BrowserView
"""

from Products.Five import BrowserView
from plone.app.async.browser.queue import JobsView as PloneJobsView

class JobsView(BrowserView):

    def js(self, timeout=30000):
        """Returns the javascript code for async call
        """
        return PloneJobsView.js.replace('5000', str(timeout))
