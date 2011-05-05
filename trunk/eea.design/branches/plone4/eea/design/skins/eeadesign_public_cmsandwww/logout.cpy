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

#### eea logout and change skin to EEADesign2006
#portal_skins = getToolByName(context, 'portal_skins')
#portal_skins.changeSkin("EEADesign2006", REQUEST)
#context.restrictedTraverse('@@skinchanger').changeskin('eeadesign2006')
#### end eea

portal = context.portal_url
mt = getToolByName(context, 'portal_membership')
mt.logoutUser(REQUEST=REQUEST)
REQUEST.RESPONSE.setCookie('plone_skin', '', path=REQUEST['BASEPATH1'] + '/' + portal(1))

from Products.CMFPlone.utils import transaction_note
transaction_note('Logged out')


target_url = REQUEST.URL1
# Double '$' to avoid injection into TALES
target_url = target_url.replace('$','$$')
target_url += '/logged_out'
return state.set(next_action='redirect_to:string:' + target_url )
