""" Page design
"""
from zope.app.annotation.interfaces import IAnnotations
from Products.Five import BrowserView
from persistent.dict import PersistentDict

KEY = 'eea.design'

class AnnotationView(BrowserView):
    """ Annotation View
    """
    def __init__(self, context, request):
        self.context = context
        self.request = request
        annotations = IAnnotations(context.getCanonical())
        mapping = annotations.get(KEY)
        if mapping is None:
            mapping = annotations[KEY] = PersistentDict({
                'page_background': None,
            })
        self.mapping = mapping

class PageDesignView(AnnotationView):
    """ Page Design View
    """
    def getBackgroundURL(self):
        """ Get background URL
        """
        return self.mapping.get('page_background')

class PageDesignEditView(AnnotationView):
    """ Page Design Edit
    """
    def setBackgroundURL(self, url):
        """ Set background URL
        """
        self.mapping['page_background'] = url

    def __call__(self):
        url = self.request.form.get('url', None)
        if url != None:
            self.setBackgroundURL(url)
