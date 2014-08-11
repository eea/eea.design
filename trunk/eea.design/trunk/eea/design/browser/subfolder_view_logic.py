""" Subfolder
"""
from zope.component import queryMultiAdapter
from zope.component import getMultiAdapter
from Products.CMFCore.utils import getToolByName
from Products.Five import BrowserView
from types import GeneratorType

def _get_contents(obj, size_limit, request, facetednav=None):
    """ Get contents of folderish brain (cachable list/dict format)
    """
    brains = []
    if facetednav:
        query = facetednav.default_criteria
        brains = facetednav.query(batch=False, sort=True, **query)
    elif obj.portal_type == 'Folder':
        brains = obj.getFolderContents()
    elif obj.portal_type in ['Topic']:
        brains = obj.queryCatalog()

    # NOTE: plone4 brains from topics end up as
    # generators therefore we need to convert it
    # back to a list to have a length and be able to slice it
    if isinstance(brains, GeneratorType):
        brains = [obj for obj in brains]

    if not brains:
        return False
    return [{
        'title': brain.Title,
        'description': brain.Title,
        'url': brain.getURL(),
        'listing_url': getMultiAdapter((brain.getObject(), request), name=u'url'
                                       ).listing_url,
        'portal_type': brain.portal_type,
    } for brain in brains[:size_limit]], len(brains)

class SubFolderView(BrowserView):
    """ Lists all sub items in context's folders/topics etc.
    """

    def get_start_items(self):
        """ Start items
        """
        return self.context.getFolderContents()


    def folder_contents(self, size_limit=10, folderContents=None,
                        obj_link=None):
        """ Get the folderish items in cachable list/dict format
        """
        size_limit = int(self.request.get('size_limit', size_limit))
        ret = {
            'folderish': [],
            'nonfolderish': [],
        }

        # check if we have a noOfSubobjects property for the size limit
        # of the subfolders contents
        portal_properties = getToolByName(self.context, 'portal_properties')
        frontpage_properties = getattr(portal_properties,
                                                'frontpage_properties')
        subobjects_properties = frontpage_properties.get('noOfSubObjects')
        if subobjects_properties:
            size_limit = subobjects_properties

        if folderContents is None:
            folderContents = self.get_start_items()

        for brain in folderContents:
            if brain.getURL() == self.context.absolute_url():
                continue

            obj = brain.getObject()
            # #5197
            # get the folder url and title instead of default's page 
            # for pages that need it like folder_tabs_view
            # but get the results of the topic if it's default page
            title = obj.Title()
            url = obj.absolute_url()
            if not obj_link:
                defaultPage = obj.getDefaultPage()
                if defaultPage:
                    item  = getattr(obj, defaultPage)
                    if item.portal_type == "Topic":
                        obj = item

            listing_url = getMultiAdapter((obj, self.request), name=u'url'
                                          ).listing_url
            facetednav = queryMultiAdapter((obj, self.request),
                                           name=u'faceted_query')
            if (obj.portal_type in ['Folder', 'Topic']) or facetednav:
                res = _get_contents(
                    obj, size_limit, self.request, facetednav)
                if res:
                    contents, nitems = res
                    ret['folderish'].append({
                        'title': title,
                        'description': obj.Description(),
                        'url': url,
                        'listing_url': listing_url,
                        'portal_type': obj.portal_type,
                        'contents': contents,
                        'has_more': nitems > size_limit,
                        'nitems': nitems,
                    })
            else:
                relatedObjects = obj.getRelatedItems()
                if not relatedObjects:
                    ret['nonfolderish'].append({
                        'title': obj.Title(),
                        'description': obj.Description(),
                        'url': obj.absolute_url(),
                        'listing_url': listing_url,
                        'portal_type': obj.portal_type,
                    })
        return ret
