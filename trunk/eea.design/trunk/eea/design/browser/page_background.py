from zope.app.annotation.interfaces import IAnnotations
from Products.Five import BrowserView
from persistent.dict import PersistentDict

KEY = 'eea.design'

class PageBackground(BrowserView):

    def __init__(self, context, request):
        self.context = context
        self.request = request
        annotations = IAnnotations(context.getCanonical())
        mapping = annotations.get(KEY)
        if mapping is None:
            mapping = annotations[KEY] = PersistentDict({'locations': []})
        self.mapping = mapping

    def getBackgroundURL(self):
        return self.mapping.get('page_background')

    def setBackgroundURL(self, url):
        self.mapping['page_background'] = url

    def __call__(self):
        import pdb; pdb.set_trace()
