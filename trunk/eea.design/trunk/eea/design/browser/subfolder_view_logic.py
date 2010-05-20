from Products.CMFPlone.PloneBatch import Batch
from Products.Five import BrowserView


def _get_contents(folder_brain):
    """Get contents of folderish brain (cachable list/dict format)"""
    if folder_brain.portal_type == 'Folder':
        brains = folder_brain.getObject().getFolderContents()
    elif folder_brain.portal_type in ['Topic', 'RichTopic']:
        brains = folder_brain.getObject().queryCatalog()
    return [{
        'title': brain.Title,
        'description': brain.Title,
        'url': brain.getURL(),
        'portal_type': brain.portal_type,
    } for brain in brains]


class SubFolderView(BrowserView):
    """ View that shows the contents of all subfolders in the context folder
    """

    def folder_contents(self, size_limit=10, folderContents=None):
        """Get the folderish items in cachable list/dict format"""
        size_limit = int(self.request.get('size_limit', size_limit))
        ret = []
        if folderContents == None:
            folderContents = self.context.getFolderContents()
        for brain in folderContents:
            if brain.portal_type in ['Folder', 'Topic', 'RichTopic']:
                contents = _get_contents(brain)
                ret.append({
                    'title': brain.Title,
                    'description': brain.Description,
                    'url': brain.getURL(),
                    'portal_type': brain.portal_type,
                    'contents': contents[:size_limit],
                    'has_more': len(contents) > size_limit,
                })
        return ret
