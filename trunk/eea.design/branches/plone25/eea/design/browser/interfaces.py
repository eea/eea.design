from zope.interface import Interface

class ISoerTopicSearch(Interface):

    def getTopicLabel():#pyflakes, #pylint: disable-msg = E0211 
        pass

    def getSynthesisReport():#pyflakes, #pylint: disable-msg = E0211 
        pass

    def getThematicAssesments(): #pyflakes, #pylint: disable-msg = E0211 
        pass

    def getGlobalMegatrends(): #pyflakes, #pylint: disable-msg = E0211
        pass

    def getCountryEnvironment(): #pyflakes, #pylint: disable-msg = E0211
        pass

class ISoerFrontpage(Interface):

    def getKeyFacts(): #pyflakes, #pylint: disable-msg = E0211
        pass

    def getMessages(): #pyflakes, #pylint: disable-msg = E0211
        pass

    def getSoerTopics(): #pyflakes, #pylint: disable-msg = E0211
        pass

    def getSoerLocations(): #pyflakes, #pylint: disable-msg = E0211
        pass

class IFrontPageHighlights(Interface):

    def getHigh(): #pyflakes, #pylint: disable-msg = E0211
        """ Return the published highlights with visibility `top` and that
            haven't expired. Sort by publish date and return the number
            that is configured in portal_properties.frontpage_properties.
        """

    def getMedium(): #pyflakes, #pylint: disable-msg = E0211
        """ Return highlights with visibility `middle` and the ones with
            `top` that are left over because of the configuration in
            portal_properties.frontpage_properties. """

    def getPromotions(): #pyflakes, #pylint: disable-msg = E0211
        """ Return all published promotions and group them in categories.
            Categories are defined by the folders containing the promotions. """

    def getCampaign(): #pyflakes, #pylint: disable-msg = E0211
        """ Return the campaign promotion if there is one. """

    def getMultimedia(): #pyflakes, #pylint: disable-msg = E0211
        """ Return 4 latest videos. """

    def getHighArticles(): #pyflakes, #pylint: disable-msg = E0211
        """ Return the published articles with visibility `top` and that
            haven't expired. Sort by publish date and return the number
            that is configured in portal_properties.frontpage_properties.
        """

    def getLow():  #pyflakes, #pylint: disable-msg = E0211
        """ return the published highlights with visibility bottom. """ 

    def getMediumArticles():  #pyflakes, #pylint: disable-msg = E0211
        """ Return the published articles with visibility `middle` and that 
            haven't expired. Sort by publish date and return the number 
            that is configured in portal_properties.frontpage_properties. 
        """ 

    def getLowArticles():  #pyflakes, #pylint: disable-msg = E0211
        """ Return the published articles with visibility `bottom` and that 
            haven't expired. Sort by publish date and return the number 
            that is configured in portal_properties.frontpage_properties. 
        """ 


class ISubFolderView(Interface):
    """Marker interface for SubFolderView
    """

    def folder_contents(size_limit): #pyflakes, #pylint: disable-msg = E0211, E0213
        """ Return the subfolder contents of the context folder """


class ISmartView(Interface):

    def getTemplateName(): #pyflakes, #pylint: disable-msg = E0211
        """  """
	
    def getTemplate(): #pyflakes, #pylint: disable-msg = E0211
        """  """

    def getListingMacro(): #pyflakes, #pylint: disable-msg = E0211
        """  """

