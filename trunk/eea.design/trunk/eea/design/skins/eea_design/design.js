jQuery(document).ready(function($) {

        if (!$("#multimedia-widgets").length) {  
            var secundary_portaltabs = $("<ul id='secundary-portaltabs'></ul>"),
                global_nav = $('#portal-globalnav');
            // Fix for external headers for sites with jquery < 1.4
            //$("#portaltab-pressroom, #portaltab-abouteea", global_nav).detach().appendTo(secundary_portaltabs);
            $("#portaltab-pressroom, #portaltab-abouteea", global_nav).clone(true).appendTo(secundary_portaltabs);
            $("#portaltab-pressroom, #portaltab-abouteea", global_nav).remove();
            secundary_portaltabs.appendTo(global_nav);
        }

    // removed portal-column-two from @@usergroup-userprefs #4817
    if($("#portlet-prefs").length) {
        $("#portal-column-two").remove();
        $("#portal-column-content").removeClass('width-3:4').addClass('width-full');
    }
    // View in fullscreen for urls: /data-and-maps/figure and /data-and-maps/data
    var r = /data-and-maps\/(figures|data)\/?$/;
    if (r.test(window.location.pathname)) {
        $('body').addClass('fullscreen');
        $('#icon-full_screen').parent().remove();
    }

    // #4157 move the non embedded links out of the enumeration of the embedded
    // links in order to preserve the design
    var $auto_related = $("#auto-related"),
        $prev = $auto_related.prev(),
        $dls = $auto_related.find('dl');
    if($dls.length) {
        $auto_related.detach();
        $dls.each(function(idx, item){
            var $item = $(item),
                $dt = $item.find('dt'); 
            $item.find('.portletItem').each(function(idx, item){
                if(item.className.indexOf('embedded') === -1) {
                    $(item).insertAfter($dt);
                }
            });
        });
        $auto_related.insertAfter($prev);
    }

    /**
     * Function to animate ecotip bulb
    */
    var toggleEcotipClass = function(){
        var ecotip = jQuery('#portlet-ecotip'),
            ie = $.browser.msie  && (parseInt($.browser.version, 10) < 10), 
            action, bulb, led;
        if(ie) {
            bulb = ecotip.find('.ecotip-bulb');
            led = ecotip.find('.led-bulb');
            action = function(){
                bulb.fadeToggle();
                led.fadeToggle();
            };
        }
        else {
            action = function(){ecotip.toggleClass('hover');}; 
        }

        toggleEcotipClass = function() {
            return action();
        };
        return toggleEcotipClass();
    };
    toggleEcotipClass();
    window.setInterval(toggleEcotipClass, 5000);

    function themePromotionPortlets(top_news) {
        var top_news_width = top_news.width();
        var margin = top_news_width * 0.012;
        w = Math.floor((top_news_width - 5 * margin) / 5);
        var promotions = top_news.find('.portlet-promotions');
        promotions.width(w);
        var last = promotions.last();
        promotions.not(last).css('marginRight', (Math.floor(margin) + 3) + 'px');
        last.css({'marginRight': '0px'});
    }
    // Layout of top promotions. It's safer to do this in JS as there was some rounding issues
    // with IE in window sizes that wasn't dividible by 5.
    var top_news = jQuery('#top-news-area');
    if (top_news.length) {
        themePromotionPortlets(top_news);
    }
});
