from Products.CMFCore.utils import getToolByName
from Products.CMFDefault.interfaces import ICMFDefaultSkin
from Products.Five import BrowserView
from eea.design.browser.interfaces import IEEADesignPublic, IEEADesignCMS
from plone.theme.interfaces import IDefaultPloneLayer
from plone.theme.layer import mark_layer as base_mark_layer
from zope.component import queryUtility
from zope.interface import directlyProvidedBy
from zope.interface import directlyProvides
from zope.publisher.interfaces.browser import IBrowserSkinType
from zope.publisher.interfaces.browser import IDefaultBrowserLayer


import logging
logger = logging.getLogger("eea.design")


class TestSkin(BrowserView):
    def __call__(self):
        """test view for cms skin """
        return "is CMS indeed"


default_layers = (
    IDefaultPloneLayer,
    ICMFDefaultSkin,
    IDefaultBrowserLayer,
    )

eea_skins = {
        'EEADesign2006':IEEADesignPublic,
        'EEADesignCMS':IEEADesignCMS,
    }

def change_skin(site, request):

    skin_name = request.cookies.get('plone_skin')
    if not skin_name:
        skin_name = 'EEADesign2006'
        #logger.warning("Could not get skin name, using default skin")
    else:
        #logger.info("Using skin %s" % skin_name)

    skin = queryUtility(IBrowserSkinType, name=skin_name)
    if skin is not None:
        layer_ifaces = []
        default_ifaces = []
        # We need to make sure IDefaultPloneLayer comes after
        # any other layers, even if they don't explicitly extend it.
        if IDefaultPloneLayer in skin.__iro__:
            default_ifaces += [IDefaultPloneLayer]
        for layer in directlyProvidedBy(request):
            if layer in default_layers:
                default_ifaces.append(layer)
            elif IBrowserSkinType.providedBy(layer):
                continue
            else:
                layer_ifaces.append(layer)
        ifaces = [skin,] + layer_ifaces + default_ifaces
        directlyProvides(request, *ifaces)


#import datetime
def mark_layer(site, event):
    """Mark the request with a layer corresponding to the current skin,
    as set in the portal_skins tool.
    """
    #print "event", datetime.datetime.now()
    if getattr(event.request, "_eeaplonetheme_", False):
        return
    event.request._eeaplonetheme_ = True

    portal_skins = getToolByName(site, 'portal_skins', None)
    if portal_skins is not None:
        skin_name = site.getCurrentSkinName()

        #we don't want to change the skin unless we have an EEA site
        if skin_name in eea_skins:
            change_skin(site, event.request)
            return

        base_mark_layer(site, event)
