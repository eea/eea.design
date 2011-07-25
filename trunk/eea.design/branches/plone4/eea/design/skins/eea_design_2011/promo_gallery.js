// call of the promo_gallery_script gallery
(function($) {
    $(function() { 
        
        var buttons = { previous:$('#prev-promo') ,
						next:$('#next-promo')  };
        
        $("#promo-gallery-content img").each(
                function() {
                    this.width = "448";
                    this.height = "320";
                }
        ); 
        
        var promotions = $('#promotions').lofJSidernews({     
                                             interval            : 9000,
                                             direction           : 'opacity',
											 duration            : 1500,
                                             wapperSelector      : '#promo-gallery-content',
                                             navItemsSelector    : '#promo-navigator li',
                                             navOuterSelector    : '#navigator-outer',
	                                         isPreloaded		 : false,
			                                 navigatorHeight	 : 80,
			                                 navigatorWidth		 : 170,
											 auto                : true,
                                             caption             : '.promo-item-desc',
                                             opacityClass        : '.lof-opacity',  
                                             buttons             : buttons, 
                                             toggleElement       : '#play-pause',
                                        });

    })
})(jQuery);
