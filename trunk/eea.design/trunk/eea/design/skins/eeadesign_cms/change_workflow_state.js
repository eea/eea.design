// This file must be removed once KSS become deprecated

// This code is ment to add loading info when changing state
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
    var eea_contentmenu = jQuery("#plone-contentmenu-workflow");
    if (eea_contentmenu.length) {
        var eea_contentmenu_header = jQuery("#plone-contentmenu-workflow")[0];
        var eea_contentmenu_actions = jQuery("#plone-contentmenu-workflow dd a");

        jQuery(eea_contentmenu_actions).click(function() {
            jQuery(eea_contentmenu_header).html("<strong>Loading ...&nbsp;</strong>");
        });
    }
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
