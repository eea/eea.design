from Products.CMFCore.utils import getToolByName
from Products.Five import BrowserView

LIMIT_CHARS = 380
    
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
        
    def getMessages(self):
        ret = []
        catalog = getToolByName(self.context, 'portal_catalog')
        brains = catalog({
            'portal_type': 'SOERMessage',
        })
        for brain in brains:
            text = self._prepareText(brain)
            ret.append({
                'text': text,
                'url': brain.getURL,
            })
        return ret

    def getKeyFacts(self):
        ret = []
        catalog = getToolByName(self.context, 'portal_catalog')
        brains = catalog({
            'portal_type': 'SOERKeyFact',
        })
        for brain in brains:
            text = self._prepareText(brain)
            ret.append({
                'text': text,
                'url': brain.getURL,
            })
        return ret

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
