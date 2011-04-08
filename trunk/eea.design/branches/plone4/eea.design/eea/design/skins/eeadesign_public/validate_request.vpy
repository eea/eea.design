## Controller Python Script "validate_request"
##bind container=container
##bind context=context
##bind namespace=
##bind script=script
##bind state=state
##bind subpath=traverse_subpath
##parameters=
##title=validate eea ip

from Products.CMFCore.utils import getToolByName

request = container.REQUEST
addr_list = ['127.0.0.1'] #IPs used for local dev

pp = getToolByName(context, 'portal_properties', None)
if pp:
  ips_list = getattr(pp, 'eea_internal_ips', None)
  if ips_list:
    addr_list.extend(ips_list.getProperty('allowed_ips', []))

fwd_addr = request.get('HTTP_X_FORWARDED_FOR', '')
remote_addr = request.get('REMOTE_ADDR', '')

res = False

if fwd_addr:
  res = [True for ip in addr_list if fwd_addr.startswith(ip)]
else:
  res = [True for ip in addr_list if remote_addr.startswith(ip)]

return res