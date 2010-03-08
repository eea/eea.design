// Integration JS between fancybox and EEA
$(document).ready(function() {
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
            autoDimensions: false
        });
    });
});
