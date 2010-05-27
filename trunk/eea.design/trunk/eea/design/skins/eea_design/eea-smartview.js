$(document).ready(function() {

    function markSelectedButton() {
        var smartTemplate = $.bbq.getState('smartTemplate');
        if (smartTemplate) {
            $('#smart-view-switch .selected').removeClass('selected');
            $('#smart-view-switch a[href=' + smartTemplate + ']').parent().addClass('selected');
        }
    }

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
        $.bbq.pushState({
            'smartTemplate': $(this).attr('href')
        });
    });

    $(window).bind('hashchange', function(e) {
        // If faceted navigation is enabled, we don't have to make our own
        // AJAX request.
        if (!Faceted.Window.width) {
            markSelectedButton();
            loadContent();
        }
    }).trigger('hashchange');

    $(Faceted.Events).bind(Faceted.Events.AJAX_QUERY_SUCCESS, function(evt){
        markSelectedButton();
    });

});
