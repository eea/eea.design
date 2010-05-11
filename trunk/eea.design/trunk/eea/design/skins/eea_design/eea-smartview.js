$(document).ready(function() {

    function loadContent() {
        $('#smart-view-content').html('<img src="++resource++faceted_images/ajax-loader.gif" />');
        var url = $.param.querystring($.bbq.getState('smartView'), $.param.querystring());
        $.get(url, function(data) {
            $('#smart-view-content').html(data);
            $('.listingBar a').each(function(i) {
                var batchQueryString = $.param.querystring($(this).attr('href'));
                var newUrl = $.param.querystring(location.href, batchQueryString)
                $(this).attr('href', newUrl);
            });
        }, 'html');
    }

    $('#smart-view-switch a').click(function(e) {
        e.preventDefault();
        $('#smart-view-switch .selected').removeClass('selected');
        $(this).parent().addClass('selected');
        $.bbq.pushState({
            'smartView': $(this).attr('href')
        });
        loadContent();
    });

    $(window).bind('hashchange', function(e) {
        var smartView = $.bbq.getState('smartView');
        if (smartView) {
            $('#smart-view-switch a[href=' + smartView + ']').click();
        }
    });

   $(window).trigger('hashchange'); 

});
