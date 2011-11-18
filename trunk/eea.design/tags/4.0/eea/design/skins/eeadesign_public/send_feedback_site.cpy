## Controller Python Script "send_feedback_site"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind state=state
##bind subpath=traverse_subpath
##parameters=
##title=Send feedback to portal administrator
##
REQUEST=context.REQUEST

from Products.CMFPlone.utils import transaction_note
from Products.CMFCore.utils import getToolByName
from Products.CMFPlone import PloneMessageFactory as _
from ZODB.POSException import ConflictError

##
## This may change depending on the called (portal_feedback or author)
state_success = "success"
state_failure = "failure"

if REQUEST.get('myurl', "Enter this page's url") != "Enter this page's url":
    return state.set(status=state_failure)    

plone_utils = getToolByName(context, 'plone_utils')
urltool = getToolByName(context, 'portal_url')
portal = urltool.getPortalObject()
url = urltool()

## make these arguments?
subject = REQUEST.get('subject', '')
message = REQUEST.get('message', '')
sender_from_address = REQUEST.get('sender_from_address', '')
sender_fullname = REQUEST.get('sender_fullname', '')
referer = REQUEST.get('referer', REQUEST.get('HTTP_REFERER', ''))
if referer: url = referer

send_to_address = portal.getProperty('email_from_address')
envelope_from = portal.getProperty('email_from_address')

state.set(status=state_success) ## until proven otherwise

encoding = portal.getProperty('email_charset')

variables = {'sender_from_address' : sender_from_address,
             'sender_fullname'     : sender_fullname,             
             'url'                 : url,
             'subject'             : subject,
             'message'             : message
             }

# Make the translation and send the mail in a separate thread.
mail = context.restrictedTraverse('@@mail_translation_service')
mail(portal.getId(), variables, send_to_address, envelope_from, subject=subject, subtype='plain', charset=encoding, debug=False, From=sender_from_address)

## clear request variables so form is cleared as well
REQUEST.set('message', None)
REQUEST.set('subject', None)
REQUEST.set('sender_from_address', None)
REQUEST.set('sender_fullname', None)
REQUEST.set('referer', None)

plone_utils.addPortalMessage(_(u'Mail sent.'))
return state
