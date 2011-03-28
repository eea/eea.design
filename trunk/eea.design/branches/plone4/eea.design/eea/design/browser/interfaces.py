from plone.app.portlets.interfaces import IColumn
from plone.theme.interfaces import IDefaultPloneLayer
from zope.interface import Interface
from plone.portlets.interfaces import IPortletManager


class IThemeSpecific(IDefaultPloneLayer):
    """Marker interface that defines a Zope 3 browser layer.
       If you need to register a viewlet only for the
       "eea.design" theme, this interface must be its layer
       (in design/viewlets/configure.zcml).
    """


class IFooterPortletManager(IPortletManager, IColumn):
    """we need our own portlet manager for the footer area.
    we also import Icolumn to get the portlets that are defined
    for the column area, otherwise we only get two portlets
    ( static and collection )
    """


class ISoerTopicSearch(Interface):

    def getTopicLabel():
        pass

    def getSynthesisReport():
        pass

    def getThematicAssesments():
        pass

    def getGlobalMegatrends():
        pass

    def getCountryEnvironment():
        pass

class ISoerFrontpage(Interface):

    def getKeyFacts():
        pass

    def getMessages():
        pass

    def getSoerTopics():
        pass

    def getSoerLocations():
        pass

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

    def getPromotions(): #pyflakes, #pylint: disable-msg = E0211
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

    def folder_contents(size_limit):
        """ Return the subfolder contents of the context folder """


class ISmartView(Interface):

    def getTemplateName():
        """  """

    def getTemplate():
        """  """

    def getListingMacro():
        """  """

