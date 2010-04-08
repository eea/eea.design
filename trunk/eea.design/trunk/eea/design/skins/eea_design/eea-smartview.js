$(document).ready(function() {
    $('#eea-template-switch a').click(function(e) {
        e.preventDefault();
        $.get($(this).attr('href'), function(data) {
            $('#main-macro-content').html('').append(data);
        }, 'html');
    });
});
