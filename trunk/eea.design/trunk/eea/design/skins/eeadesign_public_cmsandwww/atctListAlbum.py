## Script (Python) "atctListAlbum"
##title=Helper method for photo album view
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=images=0, others=0

from Products.CMFPlone.utils import base_hasattr, getToolByName

result = {}

if context.portal_type == 'Topic':
    queryMethod = context.queryCatalog
else:
    queryMethod = context.getFolderContents

image_types = []
if images:
    portal_atct = getToolByName(context, 'portal_atct')
    image_types = getattr(portal_atct, 'image_types', [])
    if context.portal_type == 'Topic' and \
            'ATPortalTypeCriterion' in [obj.portal_type for obj in context.listCriteria()]:
        # if portal_type is already in the smart folder's criteria
        # passing the image_types to queryMethod() doesn't have any effect.
        # so we must filter out non-image types afterwards
        show_inactive = getattr(context, 'show_inactive', False)
        objects = queryMethod(show_inactive=show_inactive)
        result['images'] = [obj for obj in objects if obj.portal_type in image_types]
    else:
        result['images'] = queryMethod({'Type':image_types})

if others:
    searchContentTypes = context.plone_utils.getUserFriendlyTypes()
    filtered = [p_type for p_type in searchContentTypes
                if p_type not in image_types and p_type != 'Folder' ]
    if filtered:
        # We don't need the full objects for the folder_listing
        result['others'] = queryMethod({'portal_type':filtered})
    else:
        result['others'] = ()

return result
