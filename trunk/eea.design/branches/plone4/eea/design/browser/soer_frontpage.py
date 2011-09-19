from Products.CMFCore.utils import getToolByName
from Products.Five import BrowserView
from eea.themecentre.themecentre import getTheme

LIMIT_CHARS = 300
    
class SoerFrontpage(BrowserView):

    def __init__(self, context, request):
        self.context = context
        self.request = request
        utils = getToolByName(context, 'plone_utils')
        if utils.isDefaultPage(context):
            self.soer = context.aq_parent
        else:
            self.soer = context

    def _prepareText(self, brain):
        text = brain.Description
        if len(text) > LIMIT_CHARS:
            lastSpace = text.find(' ', LIMIT_CHARS-10)
            text = text[:lastSpace] + '...'
        for keyword in brain.Subject:
            text = text.replace(keyword, '<b>%s</b>' % keyword, 1)
        return text
        
    def getMessages(self, topic = ''):
        ret = []
        catalog = getToolByName(self.context, 'portal_catalog')
        theme = ''
        if topic:
            theme = getTheme(self.context)
        brains = catalog.searchResults({
            'portal_type': 'SOERMessage',
            'getTheme' : theme,
            'review_state': 'published'
        })
        for brain in brains:
            text = self._prepareText(brain)
            ret.append({
                'text': text,
                'url': brain.getURL,
            })
        return ret

    def getKeyFacts(self, topic = ''):
        ret = []
        catalog = getToolByName(self.context, 'portal_catalog')
        theme = ''
        if topic:
            theme = getTheme(self.context)
        brains = catalog.searchResults({
            'portal_type': 'SOERKeyFact',
            'getTheme' : theme,
            'review_state': 'published'
        })
        for brain in brains:
            text = self._prepareText(brain)
            ret.append({
                'text': text,
                'url': brain.getURL,
            })
        return ret
    
    def getAllFactsAndMessages(self):
        """Return all SOER key facts and messages in one list"""
        topics = 'themes' in self.context.REQUEST['URL0']
        if topics:
            ret1 = self.getMessages(topic = topics);
            ret2 = self.getKeyFacts(topic = topics);
        else:
            ret1 = self.getMessages();
            ret2 = self.getKeyFacts();
        ret1.extend(ret2)
        return ret1

    def getSoerTopics(self):
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
