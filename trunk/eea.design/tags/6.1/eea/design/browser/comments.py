""" Override comments viewlet
"""

from plone.app.discussion.browser.comments import CommentsViewlet
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

class EEACommentsViewlet(CommentsViewlet):
    """EEA specific comments viewlet"""
    index = ViewPageTemplateFile('templates/comments.pt')


class EEAGoToCommentsViewlet(CommentsViewlet):
    """Viewlet with comments section link"""
    index = ViewPageTemplateFile('templates/goto_comments.pt')
