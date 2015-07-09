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


class IDocumentByLinePrefsForm(Interface):
    """ The view for document by line prefs form. """

    metatypes_showpubdate = schema.List(
        title=_(u'Portal types show publication date'),
        description=_(
            u'info is displayed for the following portal types'),
        missing_value=tuple(),
        value_type=schema.Choice(
            vocabulary="plone.app.vocabularies.ReallyUserFriendlyTypes"
        ),
        required=False
    )

    metatypes_showmoddate = schema.List(
        title=_(u'Portal types show modification date'),
        description=_(
            u'info is displayed for the following portal types'),
        missing_value=tuple(),
        value_type=schema.Choice(
            vocabulary="plone.app.vocabularies.ReallyUserFriendlyTypes"
        ),
        required=False
    )

    metatypes_showcredate = schema.List(
        title=_(u'Portal types show creation date'),
        description=_(
            u'info is displayed for the following portal types'),
        missing_value=tuple(),
        value_type=schema.Choice(
            vocabulary="plone.app.vocabularies.ReallyUserFriendlyTypes"
        ),
        required=False
    )

    metatypes_labeling_blacklist = schema.List(
        title=_(u'Portal types black list label'),
        description=_(
            u'label type is hidden for the following portal types'),
        missing_value=tuple(),
        value_type=schema.Choice(
            vocabulary="plone.app.vocabularies.ReallyUserFriendlyTypes"
        ),
        required=False
    )

    allowed_types_rights = schema.List(
        title=_(u'Portal types show rights'),
        description=_(
            u'Copyright info is displayed for the following portal types'),
        missing_value=tuple(),
        value_type=schema.Choice(
            vocabulary="plone.app.vocabularies.ReallyUserFriendlyTypes"
        ),
        required=False
    )


class DocumentByLineControlPanelAdapter(SchemaAdapterBase):
    """ Control Panel adapter """

    adapts(IPloneSiteRoot)
    implements(IDocumentByLinePrefsForm)

    def __init__(self, context):
        super(DocumentByLineControlPanelAdapter, self).__init__(context)
        pprop = getUtility(IPropertiesTool)
        self.site_props = getattr(pprop, 'site_properties', None)
        self.context = context

    def get_metatypes_showpubdate(self):
        """ get metatypes_showpubdate from site_props """
        return self.site_props.metatypes_showpubdate

    def set_metatypes_showpubdate(self, allowed_types):
        """ set metatypes_showpubdate to site_props """
        self.site_props.metatypes_showpubdate = allowed_types

    def get_metatypes_showmoddate(self):
        """ get allowed_types from site_props """
        return self.site_props.metatypes_showmoddate

    def set_metatypes_showmoddate(self, allowed_types):
        """ set allowed_types to site_props """
        self.site_props.metatypes_showmoddate = allowed_types

    def get_metatypes_showcredate(self):
        """ get allowed_types from site_props """
        return self.site_props.metatypes_showcredate

    def set_metatypes_showcredate(self, allowed_types):
        """ set allowed_types to site_props """
        self.site_props.metatypes_showcredate = allowed_types

    def get_metatypes_labelingblacklist(self):
        """ get allowed_types from site_props """
        return self.site_props.metatypes_labeling_blacklist

    def set_metatypes_labelingblacklist(self, allowed_types):
        """ set allowed_types to site_props """
        self.site_props.metatypes_labeling_blacklist = allowed_types

    def get_allowed_types_rights(self):
        """ get allowed_types from site_props """
        return self.site_props.allowed_types_rights

    def set_allowed_types_rights(self, allowed_types):
        """ set allowed_types to site_props """
        self.site_props.allowed_types_rights = allowed_types

    metatypes_showpubdate = property(
        get_metatypes_showpubdate, set_metatypes_showpubdate)
    metatypes_showmoddate = property(
        get_metatypes_showmoddate, set_metatypes_showmoddate)
    metatypes_showcredate = property(
        get_metatypes_showcredate, set_metatypes_showcredate)
    metatypes_labeling_blacklist = property(
        get_metatypes_labelingblacklist, set_metatypes_labelingblacklist)
    allowed_types_rights = property(
        get_allowed_types_rights, set_allowed_types_rights)


class DocumentByLinePrefsForm(ControlPanelForm):
    """ The view class for the rights preferences form. """

    implements(IDocumentByLinePrefsForm)
    form_fields = form.FormFields(IDocumentByLinePrefsForm)

    label = _(u'Document by line setting')
    description = _(u'Select which content type must show in documentbyline')
    form_name = _(u'')
