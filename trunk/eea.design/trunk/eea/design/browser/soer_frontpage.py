from Products.CMFCore.utils import getToolByName
from Products.Five import BrowserView

class SoerFrontpage(BrowserView):

    def getSearchURL(self):
        return self.context.absolute_url() + '/search'

    def getTopicSearchURL(self):
        return self.context.absolute_url() + '/soer_topic_search'

    def getMessages(self):
        ret = []
        catalog = getToolByName(self.context, 'portal_catalog')
        brains = catalog({
            'portal_type': 'SOERMessage',
        })
        for brain in brains:
            text = brain.Description
            if len(text) > 400:
                text = text[:400] + '...'
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
            text = brain.Description
            if len(text) > 400:
                text = text[:400] + '...'
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
                'label': 'Region name (alpine region, Carpathians, Baltic sea)',
                'tags': 'region name',
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
