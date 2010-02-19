/* This JS integrates the jQuery Tools Tooltips with the EEA site. */
$(document).ready(function() {
    if ($.fn.tooltip !== undefined) {
        $(".eea-tooltip-top").each(function(i) {
            var title = $(this).attr("title");
            $(this).after($('<div class="eea-tooltip-markup-top">' + title + '</div>'));
            $(this).tooltip({
                effect: 'slide'
            });
        });
        $(".eea-tooltip-bottom").each(function(i) {
            var title = $(this).attr("title");
            $(this).after($('<div class="eea-tooltip-markup-bottom">' + title + '</div>'));
            $(this).tooltip({
                effect: 'slide',
                position: 'bottom center'
            });
        });
        $(".eea-tooltip-left").each(function(i) {
            var title = $(this).attr("title");
            $(this).after($('<div class="eea-tooltip-markup-left">' + title + '</div>'));
            $(this).tooltip({
                effect: 'slide',
                position: 'center left'
            });
        });
        $(".eea-tooltip-right").each(function(i) {
            var title = $(this).attr("title");
            $(this).after($('<div class="eea-tooltip-markup-right">' + title + '</div>'));
            $(this).tooltip({
                effect: 'slide',
                position: 'center right'
            });
        });
    }
});
