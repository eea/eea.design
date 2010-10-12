from Products.Five import BrowserView

LABELS = {
    'climate change': 'Climate Change',
    'nature and biodiversity': 'Nature and biodiversity',
    'land use': 'Land use',
    'soil': 'Soil',
    'marine and coastal': 'Marine and coastal environment',
    'consumption': 'Consumption',
    'material resources, natural resources, waste': 'Material resources and waste',
    'freshwater quality, water resources': 'Freshwater',
    'air pollution': 'Air pollution',
    'urban environment': 'Urban environment',
    'global megatrends': 'Global megatrends',
}

class SoerTopicSearch(BrowserView):

    def getTopicLabel(self):
        tag = self.request.get('topic')
        return LABELS.get(tag, tag)
