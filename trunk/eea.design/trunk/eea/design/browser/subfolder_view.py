from Products.CMFPlone import Batch
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

    def folder_contents(self, b_size=5):
        """Get the folderish items in cachable list/dict format"""
        ret = []
        for brain in self.context.getFolderContents():
            if brain.portal_type in ['Folder', 'Topic', 'RichTopic']:
                ret.append({
                    'title': brain.Title,
                    'description': brain.Description,
                    'url': brain.getURL(),
                    'portal_type': brain.portal_type,
                    'contents': _get_contents(brain),
                })
        b_start = self.request.get('b_start', 0)
        batch = Batch(ret, b_size, int(b_start), orphan=0)
        return batch
