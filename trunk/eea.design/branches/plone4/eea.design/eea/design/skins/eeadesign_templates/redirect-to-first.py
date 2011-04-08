## Controller Python Script "redirect-to-first"
##bind context=context
##bind namespace=
##parameters=
##title=Redirect to the first content object in the folder.
##
content = context.contentValues()
if content and len(content)>1:
    first = content[0]
else:
    first = context
    
request = context.REQUEST
RESPONSE =  request.RESPONSE
RESPONSE.redirect(first.absolute_url())
