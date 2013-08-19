##parameters=

if context.portal_membership.isAnonymousUser():
    return []

userId = context.portal_membership.getAuthenticatedMember().getId()

result = context.restrictedTraverse('@@reviewlist')()
result = [ obj for obj in result
                 if obj.Creator != userId ]

return result
