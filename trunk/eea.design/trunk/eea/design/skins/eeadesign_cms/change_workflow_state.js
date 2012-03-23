// This file must be removed once KSS become deprecated

// This code is ment to add loading info when changing state
jQuery(document).ready(function ($) {
    var eea_contentmenu = jQuery("#plone-contentmenu-workflow");
    if (eea_contentmenu.length) {
        var eea_contentmenu_header = jQuery("#plone-contentmenu-workflow")[0];
        var eea_contentmenu_actions = jQuery("#plone-contentmenu-workflow dd a");

        jQuery(eea_contentmenu_actions).click(function() {
            jQuery(eea_contentmenu_header).html("<strong>Loading ...&nbsp;</strong>");
        });
    }
});

if(window.EEAPloneAdmin === undefined){
  var EEAPloneAdmin = {'version': '1.0'};
}

// EEAPloneAdmin ChangeWorkflowState plugin
EEAPloneAdmin.ChangeWorkflowState = function(context, options){
  var self = this;
  if(options){
    jQuery.extend(self.settings, options);
  }

  self.initialize();
};

EEAPloneAdmin.ChangeWorkflowState.prototype = {
  initialize: function(){
    console.log('EEAPloneAdmin starting');
    var eea_contentmenu = jQuery("#plone-contentmenu-workflow");
    if (eea_contentmenu.length) {
        var eea_contentmenu_header = jQuery("#plone-contentmenu-workflow")[0];
        var eea_contentmenu_actions = jQuery("#plone-contentmenu-workflow dd a");

        console.log(eea_contentmenu_actions.length);
        jQuery(eea_contentmenu_actions).click(function() {
            jQuery(eea_contentmenu_header).html("<strong>Loading ...&nbsp;</strong>");
        });
    }
    console.log('EEAPloneAdmin end');
  },
}

// jQuery plugin for EEAPloneAdmin.ChangeWorkflowState
jQuery.fn.EEAPloneAdminChangeWorkflowState = function(options){
  return this.each(function(){
    var context = jQuery(this).addClass('eea-ajax');
    var geoview = new EEAPloneAdmin.ChangeWorkflowState(context, options);
    context.data('EEAPloneAdminChangeWorkflowState', geoview);
  });
};

kukit.actionsGlobalRegistry.register("EEAPloneAdminChangeWorkflowState", function (oper) {
    jQuery('#plone-contentmenu-workflow').EEAPloneAdminChangeWorkflowState();
});
