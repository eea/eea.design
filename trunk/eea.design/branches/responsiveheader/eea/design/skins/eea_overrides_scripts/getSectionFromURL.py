## Script (Python) "getSection"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=plone_view=None
##title=Returns section name (first part of URL) to the body tag
##
contentPath = context.portal_url.getRelativeContentPath(context)

# Languages where we want wider left column to fit long word titles
longwordLanguages = ['sv',]

if not contentPath:
    if getattr(context, 'getLayout', None):
        section = context.getLayout()
    else:
        return None
else:
    if len(contentPath) > 1:
        section = contentPath[1]
    else:
        section = contentPath[0]
        
    section = "section-" + section.replace('_','-')

if plone_view is not None:
    url = context.REQUEST.get('URL', '')
    if url.endswith('/'): url = url[:-1]
    default_view = plone_view.getViewTemplateId()
    if url.endswith(context.getId()) or default_view and url.endswith(default_view) and default_view in ['frontpage_view','localfrontpage_view']:
        section = section + " frontpage "

if 'frontpage' not in section and contentPath and contentPath[0] in longwordLanguages:
        section = "longwordlanguage " + section

return section
