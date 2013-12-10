// This code is ment to disable install profile of Products.LDAPUserFolder via site setup
jQuery(document).ready(function ($) {
    var LDAPUserFolder_control = $(".configlets li input#LDAPUserFolder");

    if (LDAPUserFolder_control) {
        var LDAPUserFolder_configlet = LDAPUserFolder_control.parent();

        LDAPUserFolder_control.attr("disabled", true);
        LDAPUserFolder_configlet.append('<label style="color: red; padding-left: 4em">Profile for LDAP User Folder was disabled as it is meant for pure CMF sites only.</label>');
    }
});
