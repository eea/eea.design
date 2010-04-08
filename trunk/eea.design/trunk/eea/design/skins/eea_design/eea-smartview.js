$(document).ready(function() {
    $('#eea-template-switch a').click(function(e) {
        e.preventDefault();
        $('#main-macro-content').html('Loading...');
        $('#eea-template-switch .selected').removeClass('selected');
        $(this).parent().addClass('selected');
        $.get($(this).attr('href'), function(data) {
            $('#main-macro-content').html('').append(data);
        }, 'html');
    });
});
