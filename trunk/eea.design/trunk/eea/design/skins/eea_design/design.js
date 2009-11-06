var DESIGN_MIN_WIDTH = 972;
var DESIGN_MAX_WIDTH = 1280;

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

    var topNewsArea = $('#top-news-area');
    topNewsArea.height(topNewsArea.width() * 0.1);
    // Layout of top promotions. For some reason IE got a tiny margin to the
    // right (worked if I set the .portlet-promotion width to 19%), when
    // doing this in pure CSS. Don't know why. Think it's us who are setting
    // an IE specific margin/padding somewhere, but right now I don't have the
    // time nor tools to find out where.
    // --Per Thulin, 2009-11-05
    var margin = $('#top-news-area').width() * 0.03; // 5% margin
    var w = ($('#top-news-area').width() - 4 * margin) / 5;
    $('#top-news-area .portlet-promotions').width(w);
    $('#top-news-area .portlet-promotions:lt(4)').css('marginRight', Math.floor(margin) + 'px');
    $('#top-news-area .portlet-promotions:last').css({'marginRight': '0', 'float': 'right'});

    // Multimedia highlights layout
    //var wrapper_w = $("#multimedia-highlights").width();
    //var big_img = $("#multimedia-highlights img:last").width(0.7 * wrapper_w);
    //$("#multimedia-highlights ul").width(0.2 * wrapper_w).height(big_img.height());
    //$("#multimedia-highlights ul img").width(0.2 * wrapper_w);

    // Make sure the height of our images stick to 16:9. Can be removed when
    // we have correct aspect ratio on the uploaded images.
    $("#multimedia-highlights img, #top-news-area img").each(function(i) {
        $(this).height((9/16) * $(this).width());
    });

    // Add margins so that the #multimedia-highlights ul fill up the same height as the #big_vid.
    // TODO: why does the ul look a little bit too big in IE6 and 7?
    var margin = ($('#big_vid').height() - ($("#multimedia-highlights ul li img").height() * 3)) / 2;
    $("#multimedia-highlights ul img:lt(2)").css('marginBottom', margin + 'px');
});
