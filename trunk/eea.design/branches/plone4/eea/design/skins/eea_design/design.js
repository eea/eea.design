var DESIGN_MIN_WIDTH = 972;
var DESIGN_MAX_WIDTH = 1280;

$(document).ready(function() {
        var secundary_portaltabs = $("<ul id='secundary-portaltabs'></ul>"),
            global_nav = $('#portal-globalnav');
        $("#portaltab-pressroom, #portaltab-abouteea", global_nav).detach().appendTo(secundary_portaltabs);
        secundary_portaltabs.appendTo(global_nav);
        
        
    // View in fullscreen for urls: /data-and-maps/figure and /data-and-maps/data
    var r = /data-and-maps\/(figures|data)\/?$/;
    if (r.test(window.location.pathname)) {
        $('body').addClass('fullscreen');
        $('#icon-full_screen').parent().remove();
    }
    
    setInterval('toggleEcotipClass', 5000);
});

$(window).load(function() {
    $(window).resize();
});

$(window).resize(function() {
    // CSS max/min width doesn't work in IE, so we do it in JS instead:
    var wrapper = $('#visual-portal-wrapper');
    var w = wrapper.width();
    if (w < DESIGN_MIN_WIDTH) {
        wrapper.width(DESIGN_MIN_WIDTH);
    } else if (w > DESIGN_MAX_WIDTH) {
        wrapper.width(DESIGN_MAX_WIDTH);
    }

    // Layout of top promotions. It's safer to do this in JS as there was some rounding issues
    // with IE in window sizes that wasn't dividible by 5.
    var top_news = $('#top-news-area'),
        top_news_width = top_news.width();
    var margin = top_news_width * 0.012;
    var w = Math.floor((top_news_width - 5 * margin) / 5);
    var promotions = top_news.find('.portlet-promotions');
    promotions.width(w);
    var last = promotions.last();
    promotions.not(last).css('marginRight', (Math.floor(margin) + 2) + 'px');
    last.css({'marginRight': '0px', 'float': 'right'});

    // Add margins so that the #multimedia-highlights ul fill up the same height as the #big_vid.
    // TODO: why does the ul look a little bit too big in IE6 and 7?
    // margin = ($('#big_vid').height() - ($("#multimedia-highlights ul li img").height() * 3)) / 2;
    // $("#multimedia-highlights ul img:lt(2)").css('marginBottom', margin + 'px');

    // Make sure both frontpage columns have the same height:
    // TODO: ichimdav disabled automatic height of panels because of removal of
    // items from production site
    // var largest_column_height = Math.max($("#articles-area").height(), $("#highlights-area").height());
    // $(".frontpage .column-area").height(largest_column_height);
});

/**
 * Function to animate ecotip bulb
*/
function toggleEcotipClass(){
        ecotip = $('#portlet-ecotip');
        
        if( ecotip.hasClass('hover') ){
                ecotip.removeClass('hover');
        }else {
                ecotip.addClass('hover');
        }
        
        return false;
}
