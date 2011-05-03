from plone.app.portlets.portlets.navigation import Renderer
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from zope.component import adapts
from zope.interface import Interface
from zope.publisher.interfaces.browser import IBrowserView
from zope.publisher.interfaces.browser import IDefaultBrowserLayer
from plone.app.portlets.manager import ColumnPortletManagerRenderer
from eea.design.browser.interfaces import IFooterPortletManager

class CMSNavigationPortlet(Renderer):
    """
    A renderer for the CMS footer portlet
    """
    _template = ViewPageTemplateFile("templates/navigation.pt")
    recurse = ViewPageTemplateFile("templates/navigation_recurse_cms.pt")


class EEANavigationPortlet(Renderer):
    """
    A renderer for the public footer portlet
    """
    _template = ViewPageTemplateFile("templates/navigation.pt")
    recurse = ViewPageTemplateFile("templates/navigation_recurse.pt")


class EEAFooterPortletRenderer(ColumnPortletManagerRenderer):
    """
    A renderer for the footer portlets
    """
    adapts(Interface, IDefaultBrowserLayer, IBrowserView, IFooterPortletManager)
    template = ViewPageTemplateFile('templates/renderer.pt')
