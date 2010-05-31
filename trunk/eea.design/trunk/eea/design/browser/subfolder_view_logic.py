from zope.component import queryMultiAdapter
from zope.component import getMultiAdapter
from Products.Five import BrowserView
from eea.rdfrepository.interfaces import IFeed
from Products.EEAContentTypes.interfaces import IFeedPortletInfo

def _get_contents(folder_brain, size_limit, request, facetednav=None):
    """Get contents of folderish brain (cachable list/dict format)"""
    obj = folder_brain.getObject()
    if facetednav:
        query = facetednav.default_criteria
        brains = facetednav.query(batch=False, sort=True, **query)
    elif folder_brain.portal_type == 'Folder':
        brains = obj.getFolderContents()
    elif folder_brain.portal_type in ['Topic', 'RichTopic']:
        brains = obj.queryCatalog()
    return [{
        'title': brain.Title,
        'description': brain.Title,
        'url': brain.getURL(),
        'listing_url': getMultiAdapter((brain.getObject(), request), name=u'url').listing_url,
        'portal_type': brain.portal_type,
    } for brain in brains[:size_limit]], len(brains)

class SubFolderView(BrowserView):
    """ Lists all sub items in context's folders/topics etc.
    """

    def get_start_items(self):
        return self.context.getFolderContents()


    def folder_contents(self, size_limit=10, folderContents=None):
        """Get the folderish items in cachable list/dict format"""
        size_limit = int(self.request.get('size_limit', size_limit))
        ret = {
            'folderish': [],
            'nonfolderish': [],
        }

        if folderContents == None:
            folderContents = self.get_start_items()

        for brain in folderContents:
            if brain.getURL() == self.context.absolute_url():
                continue
            obj = brain.getObject()
            listing_url = getMultiAdapter((obj, self.request), name=u'url').listing_url
            facetednav = queryMultiAdapter((obj, self.request), name=u'faceted_query')
            if (brain.portal_type in ['Folder', 'Topic', 'RichTopic']) or facetednav:
                contents, nitems = _get_contents(brain, size_limit, self.request, facetednav)
                ret['folderish'].append({
                    'title': brain.Title,
                    'description': brain.Description,
                    'url': brain.getURL(),
                    'listing_url': listing_url,
                    'portal_type': brain.portal_type,
                    'contents': contents,
                    'has_more': nitems > size_limit,
                    'nitems': nitems,
                })
            else:
                relatedObjects = obj.getRelatedItems()
                foundRSSFeedRecipe = False
                if relatedObjects:
                    for relatedObj in  relatedObjects:
                        if relatedObj.portal_type == 'RSSFeedRecipe':
                            feed = IFeedPortletInfo(IFeed(relatedObj))
                            ret['folderish'].append({
                                'title': brain.Title,
                                'description': brain.Description,
                                'url': brain.getURL(),
                                'listing_url': listing_url,
                                'portal_type': brain.portal_type,
                                'contents': [ {'title': item.title,
                                               'description': item.title,
                                               'url': item.url,
                                               'listing_url': item.url,
                                               'image' : item.image,
                                               'portal_type': 'FeedItem',
                                               } for item in feed.items[:size_limit] ],
                                'nitems': len(feed.items),
                                'has_more': len(feed.items) > size_limit,
                            })
                            foundRSSFeedRecipe = True
                if (not relatedObjects) or (not foundRSSFeedRecipe):
                    ret['nonfolderish'].append({
                        'title': brain.Title,
                        'description': brain.Description,
                        'url': brain.getURL(),
                        'listing_url': listing_url,
                        'portal_type': brain.portal_type,
                    })
        return ret
