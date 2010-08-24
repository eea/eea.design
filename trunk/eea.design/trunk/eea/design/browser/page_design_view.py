from zope.app.annotation.interfaces import IAnnotations
from Products.Five import BrowserView
from persistent.dict import PersistentDict

KEY = 'eea.design'

class AnnotationView(BrowserView):

    def __init__(self, context, request):
        self.context = context
        self.request = request
        annotations = IAnnotations(context.getCanonical())
        mapping = annotations.get(KEY)
        if mapping is None:
            mapping = annotations[KEY] = PersistentDict({'locations': []})
        self.mapping = mapping

class PageDesignView(AnnotationView):

    def getBackgroundURL(self):
        return self.mapping.get('page_background')

class PageDesignEditView(AnnotationView):

    def setBackgroundURL(self, url):
        self.mapping['page_background'] = url

    def __call__(self):
        url = self.request.form.get('url', None)
        if url != None:
            self.setBackgroundURL(url)
