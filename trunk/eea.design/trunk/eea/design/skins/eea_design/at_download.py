## Script (Python) "at_download"
##title=Download a file keeping the original uploaded filename
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath

request = container.REQUEST
response =  request.response
return response.redirect(context.absolute_url() + '/download')

### Disabled due to #14735

#from zExceptions import NotFound
#
#if traverse_subpath:
#    field = context.getWrappedField(traverse_subpath[0])
#else:
#    field = context.getPrimaryField()
#    if not field:
#        field = context.getWrappedField('file')
#
#if field == None:
#    raise NotFound
#
#return field.download(context)
