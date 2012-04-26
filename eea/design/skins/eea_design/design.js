jQuery(document).ready(function($) {

        if (!$("#multimedia-widgets").length) {  
            var secundary_portaltabs = $("<ul id='secundary-portaltabs'></ul>"),
                global_nav = $('#portal-globalnav');
            $("#portaltab-pressroom, #portaltab-abouteea", global_nav).detach().appendTo(secundary_portaltabs);
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

    /**
     * Function to animate ecotip bulb
    */
    function toggleEcotipClass(){
        var ecotip = jQuery('#portlet-ecotip');
        ecotip.toggleClass('hover');
    }

    window.setInterval(toggleEcotipClass, 5000);

    // Layout of top promotions. It's safer to do this in JS as there was some rounding issues
    // with IE in window sizes that wasn't dividible by 5.
    var top_news = jQuery('#top-news-area');
    if (top_news.length) {
        themePromotionPortlets(top_news);
    }

});

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
