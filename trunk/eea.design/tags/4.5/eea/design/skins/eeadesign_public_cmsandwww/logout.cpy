## Controller Python Script "logout"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind state=state
##bind subpath=traverse_subpath
##title=Logout handler
##parameters=

from Products.CMFCore.utils import getToolByName

REQUEST = context.REQUEST

portal = context.portal_url
mt = getToolByName(context, 'portal_membership')
mt.logoutUser(REQUEST=REQUEST)

### eea
REQUEST.RESPONSE.setCookie('plone_skin', 'EEADesign2006', path=REQUEST['BASEPATH1'] + '/' + portal(1))
### /eea

from Products.CMFPlone.utils import transaction_note
transaction_note('Logged out')


target_url = REQUEST.URL1
# Double '$' to avoid injection into TALES
target_url = target_url.replace('$','$$')
target_url += '/logged_out'
return state.set(next_action='redirect_to:string:' + target_url )
