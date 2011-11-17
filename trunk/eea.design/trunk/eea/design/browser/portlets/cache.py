from Products.CMFCore.utils import getToolByName
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.app.portlets.portlets import base
from plone.portlets.interfaces import IPortletDataProvider
from zope.interface import implements
from plone.memoize.compress import xhtml_compress


class ICachePortlet(IPortletDataProvider):
    """The cache portlet
    """


class Renderer(base.Renderer):
    """Portlet renderer.
    """
    _template = ViewPageTemplateFile('portlet_cache.pt')

    def __init__(self, *args, **kwds):
        base.Renderer.__init__(self, *args, **kwds)

    def render(self):
        """ Render
        """
        return xhtml_compress(self._template())


class Assignment(base.Assignment):
    """Portlet assignment.
    """
    implements(ICachePortlet)

    @property
    def title(self):
        """The title of the portlet in the "manage portlets" screen.
        """
        return u"Cache invalidation"


class AddForm(base.NullAddForm):
    """Portlet add form.
    """
    def create(self):
        """ Create
        """
        return Assignment()
