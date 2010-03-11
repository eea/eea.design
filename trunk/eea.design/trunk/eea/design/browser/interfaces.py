from zope.interface import Interface

class IFrontPageHighlights(Interface):

    def getHigh():
        """ Return the published highlights with visibility `top` and that
            haven't expired. Sort by publish date and return the number
            that is configured in portal_properties.frontpage_properties.
        """

    def getMedium():
        """ Return highlights with visibility `middle` and the ones with
            `top` that are left over because of the configuration in
            portal_properties.frontpage_properties. """

    def getPromotions():
        """ Return all published promotions and group them in categories.
            Categories are defined by the folders containing the promotions. """

    def getCampaign():
        """ Return the campaign promotion if there is one. """

    def getMultimedia():
        """ Return 4 latest videos. """

    def getHighArticles():
        """ Return the published articles with visibility `top` and that
            haven't expired. Sort by publish date and return the number
            that is configured in portal_properties.frontpage_properties.
        """

    def getLow(): 
        """ return the published highlights with visibility bottom. """ 

    def getMediumArticles(): 
        """ Return the published articles with visibility `middle` and that 
            haven't expired. Sort by publish date and return the number 
            that is configured in portal_properties.frontpage_properties. 
        """ 

    def getLowArticles(): 
        """ Return the published articles with visibility `bottom` and that 
            haven't expired. Sort by publish date and return the number 
            that is configured in portal_properties.frontpage_properties. 
        """ 


class ISubFolderView(Interface):
    """Marker interface for SubFolderView
    """
