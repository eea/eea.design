"""Rights Configlet
"""

from zope.interface import Interface, implements
from zope.component import adapts
from zope.component import getUtility

from zope.formlib import form
from zope import schema
from Products.CMFDefault.formlib.schema import SchemaAdapterBase
from Products.CMFPlone.interfaces import IPloneSiteRoot
from Products.CMFCore.interfaces import IPropertiesTool
from plone.app.controlpanel.form import ControlPanelForm
from eea.design import EEAMessageFactory as _


class IRightsPrefsForm(Interface):
    """ The view for rights  prefs form. """

    allowed_types = schema.List(
        title=_(u'Portal types'),
        description=_(
            u'Copyright info is displayed for the following portal types'),
        missing_value=tuple(),
        value_type=schema.Choice(
            vocabulary="plone.app.vocabularies.ReallyUserFriendlyTypes"
        ),
        required=False
    )


class RightsControlPanelAdapter(SchemaAdapterBase):
    """ Control Panel adapter """

    adapts(IPloneSiteRoot)
    implements(IRightsPrefsForm)

    def __init__(self, context):
        super(RightsControlPanelAdapter, self).__init__(context)
        pprop = getUtility(IPropertiesTool)
        self.rights_props = getattr(pprop, 'rights_properties', None)
        self.context = context

    def get_allowed_types(self):
        """ get allowed_types from rights_props """
        return self.rights_props.allowed_types

    def set_allowed_types(self, allowed_types):
        """ set allowed_types to rights_props """
        self.rights_props.allowed_types = allowed_types

    allowed_types = property(get_allowed_types, set_allowed_types)


class RightsPrefsForm(ControlPanelForm):
    """ The view class for the rights preferences form. """

    implements(IRightsPrefsForm)
    form_fields = form.FormFields(IRightsPrefsForm)

    label = _(u'Portal types rights setting')
    description = _(u'Select which content type must show copyright')
    form_name = _(u'')
