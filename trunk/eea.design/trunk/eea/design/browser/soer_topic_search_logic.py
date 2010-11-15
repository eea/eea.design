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

    def getSynthesisReport(self):
        tags = ['synthesis']
        topic = self.request.get('topic', None)
        if topic != None:
            tags += [i.strip() for i in topic.split(',')]
        catalog = getToolByName(self.context, 'portal_catalog')
        brains = catalog({
            'path': '/'.join(self.soer.getPhysicalPath()),
            'portal_type': ['File', 'ATFile'],
            'Subject': {
                'query': tags,
                'operator': 'or',
            },
        })
        brains = [brain for brain in brains if 'SOER2010' in brain.Subject]
        ret = []
        for brain in brains[:1]:
            ret.append({
                'url': brain.getURL(),
                'title': brain.Title,
                'description': brain.Description,
            })
        return ret

    def getThematicAssesments(self):
        tags = ['thematic assessment']
        topic = self.request.get('topic', None)
        if topic != None:
            tags += [i.strip() for i in topic.split(',')]
        catalog = getToolByName(self.context, 'portal_catalog')
        brains = catalog({
            'path': '/'.join(self.soer.getPhysicalPath()),
            'portal_type': 'File',
            'Subject': {
                'query': tags,
                'operator': 'or',
            },
        })
        brains = [brain for brain in brains if 'SOER2010' in brain.Subject]
        ret = []
        for brain in brains[:5]:
            ret.append({
                'url': brain.getURL(),
                'title': brain.Title,
                'description': brain.Description,
            })
        return ret

    def getGlobalMegatrends(self):
        tags = ['global megatrends']
        topic = self.request.get('topic', None)
        if topic != None:
            tags += [i.strip() for i in topic.split(',')]
        catalog = getToolByName(self.context, 'portal_catalog')
        brains = catalog({
            'path': '/'.join(self.soer.getPhysicalPath()),
            'portal_type': 'File',
            'Subject': {
                'query': tags,
                'operator': 'or',
            },
        })
        brains = [brain for brain in brains if 'SOER2010' in brain.Subject]
        ret = []
        for brain in brains[:5]:
            ret.append({
                'url': brain.getURL(),
                'title': brain.Title,
                'description': brain.Description,
            })
        return ret

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
