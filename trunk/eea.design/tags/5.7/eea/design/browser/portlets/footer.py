""" EEA Portlets
"""
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from zope.component import adapts
from zope.interface import Interface
from zope.publisher.interfaces.browser import IBrowserView
from zope.publisher.interfaces.browser import IDefaultBrowserLayer
from plone.app.portlets.manager import ColumnPortletManagerRenderer
from eea.design.browser.interfaces import IFooterPortletManager

class EEAFooterPortletRenderer(ColumnPortletManagerRenderer):
    """
    A renderer for the footer portlets
    """
    adapts(Interface, IDefaultBrowserLayer, IBrowserView, IFooterPortletManager)
    template = ViewPageTemplateFile('../templates/renderer.pt')

