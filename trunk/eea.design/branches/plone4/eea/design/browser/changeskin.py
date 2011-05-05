from Acquisition import aq_base
from Products.CMFCore.utils import getToolByName
from Products.Five import BrowserView
from eea.design.browser.interfaces import IEEADesignCommon, IEEADesignCMS
from zope.component import queryUtility
from zope.interface import directlyProvides, noLongerProvides, providedBy
from zope.publisher.interfaces.browser import IBrowserSkinType

#from AccessControl import getSecurityManager, Unauthorized

import logging

logger = logging.getLogger("eea.design")

SKINS = {
        'EEADesign2006':IEEADesignCommon,
        'EEADesignCMS':IEEADesignCommon,
    }


class SkinChanger(BrowserView):
    """Utilities to change the skin
    """

    def changeSkin(self, skin_name):
        """Sets the specified skin in the request
        """

        if not skin_name in SKINS:
            logger.warn("Can't change skin to %s, skin unknown" % skin_name)
            return

        for iface in SKINS.values():
            noLongerProvides(self.request, iface)

        iface = SKINS[skin_name]
        ifaces = [iface] + [list(providedBy(self.request))]

        directlyProvides(self.request, ifaces)

        #if skinname == "eeadesign2006":
            #alsoProvides(self.request, IEEADesignCommon)
            #portal_skins = getToolByName(self.context, 'portal_skins')
            #portal_skins.changeSkin("EEADesign2006", self.request)

        #if skinname == "eeadesigncms":
            #alsoProvides(self.request, IEEADesignCMS)
            #portal_skins = getToolByName(self.context, 'portal_skins')
            #portal_skins.changeSkin("EEADesignCMS", self.request)

    def switchSkin(self):
        """Records the prefered skin in the member properties
        """

        skins_tool = getToolByName(self.context, 'portal_skins')
        mtool = getToolByName(self.context, 'portal_membership')
        member = mtool.getAuthenticatedMember()

        member.setProperties(portal_skin = 'EEADesignCMS')
        skins_tool.updateSkinCookie()

        self.changeSkin('EEADesignCMS')

        #if not hasattr(aq_base(member), 'portal_skin'):
            #member.setProperties(portal_skin = 'EEADesignCMS')

        #portal_skin = member.portal_skin
        #if portal_skin == 'EEADesign2006':
            #member.setProperties(portal_skin = 'EEADesignCMS')
        #else:
            #member.setProperties(portal_skin = 'EEADesign2006')

        #skins_tool.updateSkinCookie()


#def setskin(site, event):
    #"""Eventhandler to set the skin"""

    #skin_name = find_skin(site, event.request)
    #portal = getToolByName(site, 'portal_url').getPortalObject()
    #portal.changeSkin(skin_name, event.request)


#def find_skin(site, request):

    ## define possible skins
    #PROJECT_THEME = 'EEADesign2006'
    #AFDELING_THEME = 'EEADesignCMS'
    #DEFAULT='EEADesignCMS'
    #skins=[PROJECT_THEME, AFDELING_THEME]

    ## map portal_type to theme
    #mapping={
        #'Folder': PROJECT_THEME,
        #'Image': AFDELING_THEME,
    #}

    #if not request.TraversalRequestNameStack:
        #return DEFAULT

    ## reverse to look from the root up
    #stack=[]
    #stack.extend(request.TraversalRequestNameStack)
    #stack.extend(site.getPhysicalPath())
    #stack=[x for x in stack if x and x!='/' and x!='virtual_hosting']
    #stack.append('')
    #stack=stack[::-1]

    ## support portal_css and portal_js
    #for item in stack:
        #if item in skins:
            #return item

    ## check objects
    #portal_catalog = getToolByName(site, 'portal_catalog')
    #while stack:
        #item=stack.pop()
        #path = '/'.join(stack)

        #query={}
        #query['id']=str(item)
        #query['path'] = {'query' : path}

        #brains = portal_catalog.unrestrictedSearchResults(query)
        #if brains:
            #brain=brains[0]
            #portal_type=brain.portal_type
            #try:
                #return mapping[portal_type]
            #except:
                #pass

    #return DEFAULT
