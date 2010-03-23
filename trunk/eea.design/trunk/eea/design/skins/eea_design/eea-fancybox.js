// Integration JS between fancybox and EEA
$(document).ready(function() {
    if ($.fn.fancybox !== undefined) {
        $('.fancybox').fancybox();
        $('.gallery-fancybox').each(function() {
            var href = $(this).attr('href') + "/gallery_fancybox_view";
            $(this).attr('href', href);
            $(this).fancybox({
                type: 'iframe',
                padding: 0,
                margin: 0,
                width: 780,
                height: 580,
                scrolling: 'no',
                autoScale: false,
                autoDimensions: false
            });
        });
    }
});
