jQuery(document).ready(function($) {
    // NOTE: this file is overriding the one found in
    // Products.NavigationManager
    var portlet = jQuery('dl.portletNavigationTree');
    if(portlet.length){
        var tabs = jQuery('dd.portletItem', portlet);

        // Find current index
        var index = 0;
        tabs.each(function(idx, obj){
            var here = jQuery(this);
            if(jQuery('.navTreeCurrentNode', here).length > 0){
                index = idx;
                return false;
            }
        });

        // Make accordion using jquery.tools
        portlet.tabs(
            "dl.portletNavigationTree dd.portletItem", {
                tabs: "dt.portletSubMenuHeader",
                effect: "slide",
                initialIndex: index
            });

        // Make current tab collapsible
        portlet.delegate('.current, .collapsed', 'click', function() {
            var tabs = portlet.data('tabs');
            var $this = $(this);
            if (index === tabs.getIndex()) {
                if(tabs.getCurrentTab().hasClass('current')){
                    tabs.getCurrentPane().dequeue().stop().slideUp();
                    tabs.getCurrentTab().removeClass('current').addClass('collapsed');
                }else{
                    $this.addClass('current')
                        .removeClass('collapsed')
                        .next()
                        .slideDown();
                }
            }
            index = tabs.getIndex();
        });

    }

    // general accordion implementation 
    var eea_accordion = function() {
        var $folder_panels = $('.eea-accordion-panels');
        if($folder_panels.length) {
            $($folder_panels).tabs(
                ".eea-accordion-panels div.pane",
                {tabs: '.eea-accordion-title, h2', effect: 'slide', initialIndex: 0}
            );
        }
    };

    eea_accordion();
    window.EEA = window.EEA || {};
    window.EEA.eea_accordion = eea_accordion;
});
