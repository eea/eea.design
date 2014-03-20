""" Browser controllers
"""
from Products.CMFCore.utils import getToolByName
from Products.Five import BrowserView
from eea.themecentre.themecentre import getTheme

LIMIT_CHARS = 250

class SoerFrontpage(BrowserView):
    """ SOER View
    """
    def __init__(self, context, request):
        self.context = context
        self.request = request
        utils = getToolByName(context, 'plone_utils')
        if utils.isDefaultPage(context):
            self.soer = context.aq_parent
        else:
            self.soer = context

    def _prepareText(self, brain):
        """ Prepare text
        """
        text = brain.Description
        if len(text) > LIMIT_CHARS:
            lastSpace = text.find(' ', LIMIT_CHARS-10)
            text = text[:lastSpace] + '...'
        for keyword in brain.Subject:
            text = text.replace(keyword, '<b>%s</b>' % keyword, 1)
        return text

    @staticmethod
    def getEffective(brain):
        try:
            return brain.effective.strftime("%b %d, %Y %I:%M %p")
        except ValueError:
            return ""

    def getMessages(self, topic = ''):
        """ Get messages
        """
        ret = []
        catalog = getToolByName(self.context, 'portal_catalog')
        theme = ''
        if topic:
            theme = getTheme(self.context)
        query = {
            'portal_type': 'SOERMessage',
            'review_state': 'published'
        }
        if theme:
            query['getThemes'] = theme
        brains = catalog.searchResults(query)
        for brain in brains:
            text = self._prepareText(brain)

            ret.append({
                'text': text,
                'url': brain.getURL,
                'effective': SoerFrontpage.getEffective(brain),
            })
        return ret

    def getKeyFacts(self, topic = ''):
        """ Get keyfacts
        """
        ret = []
        catalog = getToolByName(self.context, 'portal_catalog')
        theme = ''
        if topic:
            theme = getTheme(self.context)
        query = {
            'portal_type': 'SOERKeyFact',
        }
        if theme:
            query['getThemes'] = theme
        brains = catalog.searchResults(query)
        for brain in brains:
            text = self._prepareText(brain)
            ret.append({
                'text': text,
                'url': brain.getURL,
                'effective': SoerFrontpage.getEffective(brain),
            })
        return ret


    def getAllFactsAndMessages(self):
        """Return all SOER key facts and messages in one list
        """
        topics = 'themes' in self.context.REQUEST['URL0']
        if topics:
            ret1 = self.getMessages(topic = topics)
            ret2 = self.getKeyFacts(topic = topics)
        else:
            ret1 = self.getMessages()
            ret2 = self.getKeyFacts()
        ret1.extend(ret2)
        return ret1

    def getSoerTopics(self):
        """ SOER Topics
        """
        return [
            {
                'label': 'Climate Change',
                'tags': 'climate change',
            },
            {
                'label': 'Nature and biodiversity',
                'tags': 'nature and biodiversity',
            },
            {
                'label': 'Land use',
                'tags': 'land use',
            },
            {
                'label': 'Soil',
                'tags': 'soil',
            },
            {
                'label': 'Marine and coastal environment',
                'tags': 'marine and coastal',
            },
            {
                'label': 'Consumption',
                'tags': 'consumption',
            },
            {
                'label': 'Material resources and waste',
                'tags': 'material resources, natural resources, waste',
            },
            {
                'label': 'Freshwater',
                'tags': 'freshwater quality, water resources',
            },
            {
                'label': 'Air pollution',
                'tags': 'air pollution',
            },
            {
                'label': 'Urban environment',
                'tags': 'urban environment',
            },
            {
                'label': 'Global megatrends',
                'tags': 'global megatrends',
            },
        ]

    def getSoerLocations(self):
        """ SOER Locations
        """
        return [
            {
                'label': 'Country name',
                'tags': 'country name',
            },
            {
                'label': 'Former Yugoslav Republic of Macedonia',
                'tags': 'macedonia',
            },
            {
                'label': 'Europe',
                'tags': '-',
            },
            {
                'label': 'World',
                'tags': 'world',
            },
        ]
