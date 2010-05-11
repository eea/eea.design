$(document).ready(function() {

    function loadContent(url) {
        $('#smart-view-content').html('<img src="++resource++faceted_images/ajax-loader.gif" />');
        $.get(url, function(data) {
            $('#smart-view-content').html(data);
        }, 'html');
    }

    $('#smart-view-switch a').click(function(e) {
        $('#smart-view-switch .selected').removeClass('selected');
        $(this).parent().addClass('selected');
        e.preventDefault();
        var template = $(this).attr('href');
        loadContent(template);
        $.bbq.pushState({
            'template': template
        });
    });

    // Also handle click on any batch bar that will pop up
    $('.listingBar a').live('click', function(e) {
        e.preventDefault();
        loadContent($(this).attr('href'));
    });

    $(window).bind('hashchange', function(e) {
        console.log($.bbq);
        console.log($.bbq.getState('template'));
        var template = $.bbq.getState('template');
        if (template) {
            $('#smart-view-switch a[href=' + template + ']').click();
        }
    });

   $(window).trigger('hashchange'); 

});
