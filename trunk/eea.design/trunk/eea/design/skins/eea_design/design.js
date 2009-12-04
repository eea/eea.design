var DESIGN_MIN_WIDTH = 972;
var DESIGN_MAX_WIDTH = 1280;

$(document).ready(function() {
    // View in fullscreen for urls: /data-and-maps/figure and /data-and-maps/data
    var r = /data-and-maps\/(figures|data)\/?$/;
    if (r.test(window.location.pathname)) {
        $('body').addClass('fullscreen');
        $('#icon-full_screen').parent().remove();
    }

    // Add tooltips for the top frontpage promotions and multimedia area:
    if ($.fn.tooltip !== undefined) {
        $("#multimedia-highlights ul img").each(function(i) {
            var img = $(this);
            var title = img.attr("title");
            img.after($('<div class="tooltip side-tooltip">' + title + '</div>'))
            img.attr("title", ""); // Don't use removeAttr, IE still remembers it
            img.tooltip({
                effect: 'slide',
                position: 'center left'
            });
        });
        $("#big_vid").each(function(i) {
            var title = $(this).find('img').attr("title");
            $(this).after($('<div class="tooltip">' + title + '</div>'));
            $(this).find('img').attr("title", ""); // Don't use removeAttr, IE still remembers it
            $(this).tooltip({
                effect: 'slide'
            });
        });

        $("#top-news-area .portlet-promotions img").each(function(i) {
            // We want to place the tooltip markup after the <a> element
            // instead of inside it after the image. This is because otherwise the
            // link-css will be applied to the text inside the tooltip.
            var title = $(this).attr("title");
            var tooltip = $('<div class="tooltip"><p>' + title + '</p></div>');
            $(this).attr("title", "").parent().attr("title", ""); // Don't use removeAttr, IE still remembers it
            $(this).after(tooltip);
            $(this).tooltip({
                effect: 'slide'
            });
        });
    }
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

    var margin = $('#top-news-area').width() * 0.03;
    var w = ($('#top-news-area').width() - 4 * margin) / 5;
    $('#top-news-area .portlet-promotions').width(w);
    $('#top-news-area .portlet-promotions:lt(4)').css('marginRight', Math.floor(margin) + 'px');
    $('#top-news-area .portlet-promotions:last').css({'marginRight': '0', 'float': 'right'});

    // Make sure the height of our images stick to 16:9. Can be removed when
    // we have correct aspect ratio on the uploaded images.
    $("#multimedia-highlights img, #top-news-area .portlet-promotions img").each(function(i) {
        $(this).height((9/16) * $(this).width());
    });

    // Add margins so that the #multimedia-highlights ul fill up the same height as the #big_vid.
    // TODO: why does the ul look a little bit too big in IE6 and 7?
    var margin = ($('#big_vid').height() - ($("#multimedia-highlights ul li img").height() * 3)) / 2;
    $("#multimedia-highlights ul img:lt(2)").css('marginBottom', margin + 'px');

    // Make sure both frontpage columns have the same height:
    var largest_column_height = Math.max($("#articles-area").height(), $("#highlights-area").height());
    $(".frontpage .column-area").height(largest_column_height);
});
