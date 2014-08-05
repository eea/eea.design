jQuery(document).ready(function ($) {
    // This code is ment to disable install profile of Products.LDAPUserFolder via site setup
    var LDAPUserFolder_control = $(".configlets li input#LDAPUserFolder");

    if (LDAPUserFolder_control) {
        var LDAPUserFolder_configlet = LDAPUserFolder_control.parent();

        LDAPUserFolder_control.attr("disabled", true);
        LDAPUserFolder_configlet.append('<label style="color: red; padding-left: 4em; font-weight: normal">Profile for LDAP User Folder was disabled as it is meant for pure CMF sites only.</label>');
    }

    // This code is ment to disable install profile of collective.deletepermission via site setup
    var deletepermission_control = $(".configlets li input#collective\\.deletepermission");
    if (deletepermission_control) {
        var deletepermission_configlet = deletepermission_control.parent();

        deletepermission_control.attr("disabled", true);
        deletepermission_configlet.append('<br /><label style="color: red; padding-left: 4em; font-weight: normal">Profile of collective.deletepermission should not be installed, please use the EEA associated profile.</label>');
    }
});
