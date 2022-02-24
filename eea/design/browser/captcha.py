""" Captcha verify
"""
import json
import logging
from plone import api
from urllib import urlencode
from contextlib import closing
from six.moves import urllib
from Products.Five.browser import BrowserView
from plone.app.registry.browser import controlpanel
from zope.interface import Interface
from zope import schema
from eea.design import EEAMessageFactory as _
logger = logging.getLogger("eea.design")


class ICaptchaSettings(Interface):
    """ Client settings for friendly captcha
    """
    server = schema.TextLine(
        title=_(u"Captcha URL"),
        description=_(u"Captcha siteverify URL"),
        default=u"https://friendlycaptcha.com/api/v1/siteverify"
    )

    username = schema.TextLine(
        title=_(u"Captcha API KEY"),
        description=(u"Captcha API KEY"),
        default=u""
    )

    password = schema.TextLine(
        title=_(u"Captcha API SECRET"),
        description=(u"Captcha API SECRET"),
        default=u""
    )

    timeout = schema.Int(
        title=_(u"Timeout"),
        description=_(u"Request timeout"),
        default=15
    )


class ControlPanelForm(controlpanel.RegistryEditForm):
    """ Captcha control panel"""

    id = "captcha"
    label = _(u"Captcha settings")
    schema = ICaptchaSettings


class ControlPanelView(controlpanel.ControlPanelFormWrapper):
    """ Captcha Control Panel
    """
    form = ControlPanelForm


class Captcha(BrowserView):
    """ Captcha verify
    """
    @property
    def password(self):
        """ Captcha password
        """
        return api.portal.get_registry_record(
            "password", interface=ICaptchaSettings, default="")

    @property
    def username(self):
        return api.portal.get_registry_record(
            "username", interface=ICaptchaSettings, default="")

    @property
    def server(self):
        return api.portal.get_registry_record(
            "server", interface=ICaptchaSettings, default="")

    @property
    def timeout(self):
        return api.portal.get_registry_record(
            "timeout", interface=ICaptchaSettings, default=15)

    def __call__(self):
        try:
            req = urllib.request.Request(
                self.server,
                headers={"Accept": "application/json"},
                data=urlencode({
                    'sitekey': self.username,
                    'secret': self.password,
                    'solution': self.request.get('solution')
                }),
            )
            with closing(urllib.request.urlopen(
                req, timeout=self.timeout)) as conn:
                return conn.read()
        except Exception as err:
            logger.exception(err)
            return json.dumps({"success": False, "errors": repr(err)})
