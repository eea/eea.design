from Products.CMFCore.utils import getToolByName
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

PARTC_TOPIC_MAP = {
    'climate change': 'climate change',
    'nature and biodiversity': 'biodiversity',
    'land use': 'land',
    'material resources, natural resources, waste': 'waste',
    'freshwater quality, water resources': 'freshwater',
    'air pollution': 'air pollution',
    }

class SoerTopicSearch(BrowserView):

    def __init__(self, context, request):
        self.context = context
        self.request = request
        utils = getToolByName(context, 'plone_utils')
        if utils.isDefaultPage(context):
            self.soer = context.aq_parent
        else:
            self.soer = context

    def getTopicLabel(self):
        tag = self.request.get('topic')
        return LABELS.get(tag, tag)

    def _searchForContent(self, tag, count):
        tags = ['SOER2010', tag]
        catalog = getToolByName(self.context, 'portal_catalog')
        brains = catalog({
            'Subject': {
                'query': tags,
                'operator': 'and',
            },
        })

        result = []
        topic = self.request.get('topic', None)
        if topic != None:
            optional_tags = [i.strip() for i in topic.split(',')]
            for brain in brains:
                if len(result) >= count:
                    break
                for tag in optional_tags:
                    if tag in brain.Subject:
                        result.append(brain)
        else:
            result = brains
        ret = []
        for brain in result[:count]:
            ret.append({
                'url': brain.getURL(),
                'title': brain.Title,
                'description': brain.Description,
            })
        return ret


    def getSynthesisReport(self):
        return self._searchForContent('synthesis', 1)

    def getThematicAssesments(self):
        return self._searchForContent('thematic assessment', 5)

    def getGlobalMegatrends(self):
        return self._searchForContent('global megatrends', 5)

    def getCountryEnvironment(self):
        tags = []
        topic = self.request.get('topic', None)
        if topic == None or topic not in PARTC_TOPIC_MAP.keys(): 
            return []

        countries = getattr(self.soer, 'countries', None)
        countries = countries.getFolderContents({
            'portal_type': 'SOERCountry',
        })

        ret = []
        for country in countries:
            ret.append({
                    'url': '%s/soertopic_view?topic=%s' % (country.getURL(), PARTC_TOPIC_MAP.get(topic)),
                    'image' : country.getURL(),
                    'title': '%s' % country.Title,
                    'description': '%s - %s' % (country.Title, PARTC_TOPIC_MAP.get(topic)),
                })

        # Sort alphabetically on country name
        #ret.sort(lambda x, y: cmp(x.Title.lower(), y.Title.lower()))
        return ret
