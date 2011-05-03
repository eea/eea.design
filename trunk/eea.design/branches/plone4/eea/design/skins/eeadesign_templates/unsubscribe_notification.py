## Script (Python) "subscriber_account"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=email
##title=Send confirm unsubscribe mail
##

from Products.CMFCore.utils import getToolByName
request = container.REQUEST
RESPONSE =  request.RESPONSE

cat = getToolByName(container, 'portal_catalog')
newsletter_themes = cat.searchResults(portal_type = 'NewsletterTheme')
email = email.strip()
msg = 'You will receive soon an email for confirmation.'

#TODO: to be adjusted in case of multiple 'NewsletterTheme' instances
for nt in newsletter_themes:
    nt_ob = nt.getObject()
    subscriber = None

    if email in nt_ob.getEmailsCache().keys():
        subscriber = nt_ob.getSubscriberById(nt_ob.getEmailsCache()[email])
        nt_ob.confirmUnsubscribe(subscriber.id)

RESPONSE.redirect('%s/unsubscribe?msg=%s&email=%s' % (context.portal_url(), msg, email))