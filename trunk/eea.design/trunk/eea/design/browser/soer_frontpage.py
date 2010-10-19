from Products.Five import BrowserView

class SoerFrontpage(BrowserView):

    def getSearchURL(self):
        return self.context.absolute_url() + '/search'

    def getTopicSearchURL(self):
        return self.context.absolute_url() + '/soer_topic_search'

    def getMessages(self):
        ret = []
        ret.append({
            'text': "The prospects for Europe's environment are mixed but there are opportunities to make the environment more resilient to future risks and changes.",
        })
        return ret

    def getKeyFacts(self):
        ret = []
        ret.append({
            'text': "Despite improvements in some regions, diffuse pollution from agriculture remains a major cause of the poor water quality currently observed in parts of Europe.",
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
