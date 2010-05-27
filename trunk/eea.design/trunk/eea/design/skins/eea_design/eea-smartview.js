$(document).ready(function() {

    function loadContent() {
        $('#smart-view-content').html('<img src="++resource++faceted_images/ajax-loader.gif" />');
        var url = $.param.querystring($.bbq.getState('smartTemplate'), $.param.querystring());
        $.get(url, function(data) {
            $('#smart-view-content').html(data);
            $('.listingBar a').each(function(i) {
                var batchQueryString = $.param.querystring($(this).attr('href'));
                var newUrl = $.param.querystring(location.href, batchQueryString)
                $(this).attr('href', newUrl);
            });
        }, 'html');
    }

    $('#smart-view-switch a').live('click', function(e) {
        e.preventDefault();
        $('#smart-view-switch .selected').removeClass('selected');
        $(this).parent().addClass('selected');
        $.bbq.pushState({
            'smartTemplate': $(this).attr('href')
        });
        // If we run smart view w/o faceted navigation, we make our own
        // AJAX query
        if (!Faceted.Window.width) {
            loadContent();
        }
    });

    $(window).bind('hashchange', function(e) {
        var smartTemplate = $.bbq.getState('smartTemplate');
        if (smartTemplate) {
            $('#smart-view-switch a[href=' + smartTemplate + ']').click();
        }
    });

   if (!Faceted.Window.width) {
       $(window).trigger('hashchange'); 
   }

});
