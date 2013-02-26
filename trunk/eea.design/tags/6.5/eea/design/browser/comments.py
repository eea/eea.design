""" Override comments viewlet
"""

from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile
from plone.app.discussion.browser.comments import CommentsViewlet
from plone.app.layout.viewlets.common import ViewletBase


class EEACommentsViewlet(CommentsViewlet):
    """EEA specific comments viewlet"""
    index = ViewPageTemplateFile('templates/comments.pt')


class EEAGoToCommentsViewlet(CommentsViewlet):
    """Viewlet with comments section link"""
    index = ViewPageTemplateFile('templates/goto_comments.pt')

    def update(self):
        """override to disable form processing
        """
        return ViewletBase.update(self)
