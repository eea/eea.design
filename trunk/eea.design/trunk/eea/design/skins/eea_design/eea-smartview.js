$(document).ready(function() {

    function loadContent(url) {
        $('#smart-view-content').fadeOut('fast');
        $.get(url, function(data) {
            $('#smart-view-content').empty().append(data).fadeIn();
        }, 'html');
    }

    $('#smart-view-switch a').click(function(e) {
        $('#smart-view-switch .selected').removeClass('selected');
        $(this).parent().addClass('selected');
        e.preventDefault();
        loadContent($(this).attr('href'));
    });

    // Also handle click on any batch bar that will pop up
    $('.listingBar a').live('click', function(e) {
        e.preventDefault();
        loadContent($(this).attr('href'));
    });

});
