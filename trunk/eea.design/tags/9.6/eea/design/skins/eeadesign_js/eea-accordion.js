jQuery(document).ready(function($) {
    // NOTE: this file is overriding the one found in
    // Products.NavigationManager
    var portlet = jQuery('dl.portletNavigationTree');
    if (portlet.length) {
        var tabs = jQuery('dd.portletItem', portlet);

        // Find current index
        var index = 0;
        tabs.each(function(idx, obj) {
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
                }
                else {
                    $this.addClass('current')
                        .removeClass('collapsed')
                        .next()
                        .slideDown();
                }
            }
            index = tabs.getIndex();
        });

    }

    $.tools.tabs.addEffect("collapsed", function(i, done) {
        // #17555; passed an empty effect for the collapsed accordion
        // using instead use a simple slide for the accordion headers

    });
    // general accordion implementation
    var eea_accordion = function($folder_panels) {
        if(!$folder_panels){
          $folder_panels = $('.eea-accordion-panels');
        }
        if ($folder_panels.length) {

            $folder_panels.each(function(idx, el) {
                var $el = $(el);
                var effect = 'slide';
                var current_class = "current";
                var initial_index = 0;
                var initial_indexes = [];
                var $pane = $el.find('.pane');

                $el.find('.eea-accordion-title, h2').each(function(idx){
                    var $title = $(this);
                    if( $title.hasClass('current') ){
                        $title.removeClass('current');
                        initial_index = idx;
                        initial_indexes.push(idx);

                        // Can't be collapsed-by-default and have an open pane
                        // by default. Cleanup misconfiguration
                        $el.removeClass('collapsed-by-default');
                    }
                });

                if ($el.hasClass('collapsed-by-default')) {
                   // hide all panels if using the above class
                   effect = 'slide';
                   initial_index = null;
                   $pane.hide();
                }

                if ($el.hasClass('non-exclusive')) {
                    // show the first panel only if we don't have also the
                    // collapsed-by-default class
                    if ( !$el.hasClass('collapsed-by-default') ) {
                        $pane.not(':nth-child(' + (initial_index + 1) + ')').hide();
                        $pane.eq(initial_index).prev().addClass('current');
                    }

                    effect = 'collapsed';
                    current_class = "default";
                    // allow the hiding of the currently opened accordion
                    $el.find('.eea-accordion-title, h2').click(function(ev) {
                       var $el = $(this);
                       if (!$el.hasClass('current')) {
                           $el.addClass('current').next().slideDown();
                       }
                       else {
                           $el.removeClass('current').next().slideUp();
                       }
                    });
                }

                $el.tabs($pane,
                {   tabs: '.eea-accordion-title, h2',
                    effect: effect,
                    initialIndex: initial_index,
                    current: current_class,
                    onBeforeClick: function(ev, idx) {
                        // allows third party applications to hook into these 2 event handlers
                        $(ev.target).trigger("eea-accordion-before-click", { event: ev, index: idx});
                    },
                    onClick: function(ev, idx) {
                        $(ev.target).trigger("eea-accordion-on-click", { event: ev, index: idx});
                    }
                });

                // Allow multiple open-by-default panes
                if(initial_indexes.length && $el.hasClass('non-exclusive')) {
                  $el.find('.eea-accordion-title, h2').each(function(idx){
                    var $title = $(this);

                    // Nothing to do
                    if( $title.hasClass('current') ){
                      return;
                    }

                    // Not open-by-default
                    if(initial_indexes.indexOf(idx) === -1){
                      return;
                    }

                    // Open
                    $title.click();
                  });
                }

            });

        }

    };

    eea_accordion();
    window.EEA = window.EEA || {};
    window.EEA.eea_accordion = eea_accordion;
});
