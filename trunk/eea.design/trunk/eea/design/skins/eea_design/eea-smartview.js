$(document).ready(function() {
    $('#smart-view-switch a').click(function(e) {
        e.preventDefault();
        $('#smart-view-content').fadeOut('fast');
        $('#smart-view-switch .selected').removeClass('selected');
        $(this).parent().addClass('selected');
        $.get($(this).attr('href'), function(data) {
            $('#smart-view-content').html('').append(data).fadeIn();
        }, 'html');
    });
});
