from Products.Five import BrowserView
from zope.interface import directlyProvides, alsoProvides
from eea.design.browser.interfaces import IEEADesignCommon, IEEADesignCMS
from Products.CMFCore.utils import getToolByName
from Acquisition import aq_base

class SkinChanger(BrowserView):
    def changeskin(self, skinname):
        if skinname == "eeadesign2006":
            directlyProvides(self.request, IEEADesignCommon)
            portal_skins = getToolByName(self.context, 'portal_skins')
            #portal_skins.default_skin = "EEADesign2006"
            portal_skins.changeSkin("EEADesign2006", self.request)

        if skinname == "eeadesigncms":
            directlyProvides(self.request, IEEADesignCMS)
            portal_skins = getToolByName(self.context, 'portal_skins')
            portal_skins.changeSkin("EEADesignCMS", self.request)
            #portal_skins = getToolByName(self.context, 'portal_skins')
            #portal_skins.default_skin = "EEADesignCMS"

    def switchSkin(self, context):
        skins_tool = getToolByName(self, 'portal_skins')
        mtool = getToolByName(self, 'portal_membership')
        member = mtool.getAuthenticatedMember()
        if not hasattr(aq_base(member), 'portal_skin'):
            member.setProperties(portal_skin = 'EEADesignCMS')
        portal_skin = member.portal_skin
        if portal_skin == 'EEADesign2006':
            member.setProperties(portal_skin = 'EEADesignCMS')
        else:
            member.setProperties(portal_skin = 'EEADesign2006')
        skins_tool.updateSkinCookie()
#from AccessControl import getSecurityManager, Unauthorized


def setskin(site, event):
    """Eventhandler to set the skin"""
    skin_name = findMeMySkin(site, event.request)
    portal = getToolByName(site, 'portal_url').getPortalObject()
    portal.changeSkin(skin_name, event.request)

def findMeMySkin(site, request):
    # define possible skins
    PROJECT_THEME = 'EEADesign2006'
    AFDELING_THEME = 'EEADesignCMS'
    DEFAULT='EEADesignCMS'
    skins=[PROJECT_THEME, AFDELING_THEME]

    # map portal_type to theme
    mapping={
        'Folder': PROJECT_THEME,
        'Image': AFDELING_THEME,
    }

    if not request.TraversalRequestNameStack:
        return DEFAULT

    # reverse to look from the root up
    stack=[]
    stack.extend(request.TraversalRequestNameStack)
    stack.extend(site.getPhysicalPath())
    stack=[x for x in stack if x and x!='/' and x!='virtual_hosting']
    stack.append('')
    stack=stack[::-1]

    # support portal_css and portal_js
    for item in stack:
        if item in skins:
            return item

    # check objects
    portal_catalog = getToolByName(site, 'portal_catalog')
    while stack:
        item=stack.pop()
        path = '/'.join(stack)

        query={}
        query['id']=str(item)
        query['path'] = {'query' : path}

        brains = portal_catalog.unrestrictedSearchResults(query)
        if brains:
            brain=brains[0]
            portal_type=brain.portal_type
            try:
                return mapping[portal_type]
            except:
                pass

    return DEFAULT
