$(document).ready(function() {
    $('.eea-accordion-header').css('cursor', 'pointer'); // style here so that it doesn't affect users with no JS
    $('.eea-accordion-content').hide();
    $('.eea-accordion-header:first').addClass('eea-active-accordion').parent().find('.eea-accordion-content').show();
    $('.eea-accordion-header').click(function() {
        if (!$(this).hasClass('.eea-active-accordion')) {
            $('.eea-active-accordion').removeClass('eea-active-accordion').parent().find('.eea-accordion-content').slideUp();
            $(this).addClass('eea-active-accordion').parent().find('.eea-accordion-content').slideDown();
        }
    });
});
