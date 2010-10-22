import random
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
        tag = self.request.get('topic')
        catalog = getToolByName(self.context, 'portal_catalog')
        brains = catalog({
            'path': '/'.join(self.soer.getPhysicalPath()),
            'portal_type': ['File', 'ATFile'],
            'Subject': {
                'query': ['SOER2010', 'synthesis', tag],
                'operator': 'and',
            },
        })
        ret = []
        for brain in brains[:1]:
            ret.append({
                'url': brain.getURL(),
                'title': brain.Title,
                'description': brain.Description,
            })
        return ret

    def getThematicAssesments(self):
        tag = self.request.get('topic')
        catalog = getToolByName(self.context, 'portal_catalog')
        brains = catalog({
            'path': '/'.join(self.soer.getPhysicalPath()),
            'portal_type': 'File',
            'Subject': {
                'query': ['SOER2010', 'thematic assessment', tag],
                'operator': 'and',
            },
        })
        ret = []
        for brain in brains[:5]:
            ret.append({
                'url': brain.getURL(),
                'title': brain.Title,
                'description': brain.Description,
            })
        return ret

    def getCountryEnvironment(self):
        countries = getattr(self.soer, 'countries', None)
        countries = countries.getFolderContents({
            'portal_type': 'Folder',
        })

        randoms = []
        count = 0
        while len(randoms) < 5:
            count += 1
            if count > 100: # Avoid infinite loop
                break
            item = random.choice(countries)
            if not item in randoms:
                randoms.append(item)

        ret = []
        if countries != None:
            for brain in randoms:
                ret.append({
                    'url': brain.getURL(),
                    'title': brain.Title,
                    'description': brain.Description,
                })
        return ret
