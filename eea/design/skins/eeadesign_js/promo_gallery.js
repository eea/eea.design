// call of the promo_gallery_script gallery
(function($) {
    $(function() {

        var buttons = { previous:$('#prev-promo') ,
                        next:$('#next-promo')  };

        $("#promo-gallery-content img").each(
                function() {
                    this.width = "448";
                    this.height = "320";
                });
    
        var site_address = window.location.href.indexOf('themes') != '-1' ? true : undefined,
            nav_height = site_address ? 50 : 80,  
            nav_width = site_address ? 65 : 170, 
            nav_items_selector = site_address ? "#promo-navigator-sm li" : "#promo-navigator li", 
            wrapper_selector = site_address ? "#promo-gallery-content-sm" : "#promo-gallery-content",
            max_item_display = site_address ? 5 : 3,
            nav_position = site_address ? 'horizontal' : 'vertical',
            nav_outer_selector = site_address ? "#navigator-outer-sm" : "#navigator-outer";

        var promotions = $('#promo-gallery-wrapper').lofJSidernews({
                                             interval            : 9000,
                                             direction           : 'opacity',
                                             duration            : 1500,
                                             wapperSelector      : wrapper_selector,
                                             navItemsSelector    : nav_items_selector,
                                             navOuterSelector    : nav_outer_selector,
                                             isPreloaded         : false,
			                                 maxItemDisplay      : max_item_display,
                                             navigatorHeight     : nav_height,
                                             navigatorWidth      : nav_width,
                                             navPosition         : nav_position,
                                             auto                : true,
                                             caption             : '.promo-item-desc',
                                             opacityClass        : 'lof-opacity',
                                             buttons             : buttons,
                                             toggleElement       : '#play-pause'
                                        });

    });
})(jQuery);
