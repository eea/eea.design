## Script (Python) "at_download"
##title=Download a file keeping the original uploaded filename
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath

from zExceptions import NotFound

if traverse_subpath:
    field = context.getWrappedField(traverse_subpath[0])
else:
    field = context.getPrimaryField()
    if not field:
        field = context.getWrappedField('file')

if field == None:
    raise NotFound

return field.download(context)
