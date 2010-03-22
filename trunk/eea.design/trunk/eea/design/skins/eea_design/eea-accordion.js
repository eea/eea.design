$(document).ready(function() {
    $('.eea-accordion-content').hide();
    $('.eea-accordion-portlet:first').addClass('eea-active-accordion').find('.eea-accordion-content').show();
    $('.eea-accordion-header').click(function() {
        var portletClicked = $(this).parent();
        if (!portletClicked.hasClass('.eea-active-accordion')) {
            $('.eea-active-accordion').removeClass('eea-active-accordion').find('.eea-accordion-content').slideUp();
            portletClicked.addClass('eea-active-accordion').find('.eea-accordion-content').slideDown();
        }
    });
});
