## Script (Python) "subscriber_account"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind subpath=traverse_subpath
##parameters=email
##title=Redirect to subscriber account
##

from Products.CMFCore.utils import getToolByName
request = container.REQUEST
RESPONSE =  request.RESPONSE

cat = getToolByName(container, 'portal_catalog')
newsletter_themes = cat.searchResults(portal_type = 'NewsletterTheme')
email = email.strip()
url_account = ''

#TODO: to be adjusted in case of multiple 'NewsletterTheme' instances
for nt in newsletter_themes:
    nt_ob = nt.getObject()
    subscribers = nt_ob.getSubscribers()
    subscriber = None

    for brain in subscribers:
        if brain.email == email:
            subscriber = nt_ob.getSubscriberById(brain.id)
            url_account = '%s/Subscriber_editForm' % subscriber.absolute_url()

if not url_account:
    msg = 'No subscription found for this mail address.'
    url_account = '%s/subscriber_settings?err=%s&email=%s' % (context.portal_url(), msg, email)

RESPONSE.redirect(url_account)