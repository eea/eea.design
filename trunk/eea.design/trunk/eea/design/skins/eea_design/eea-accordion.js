$(document).ready(function() {
    // If the URL ends with 'dc', we open the data center accordion section.
    if (/\/dc$/.test(window.location.pathname)) {
       $('#portlet-navigation-tree-data-center-services').addClass('eea-active-accordion');
    } else {
        $('.eea-accordion-portlet:first').addClass('eea-active-accordion');
    }
    $('.eea-accordion-portlet').not('.eea-active-accordion').find('.eea-accordion-content').hide();

    $('.eea-accordion-header').click(function() {
        var portletClicked = $(this).parent();
        if (!portletClicked.hasClass('.eea-active-accordion')) {
            $('.eea-active-accordion').removeClass('eea-active-accordion').find('.eea-accordion-content').slideUp();
            portletClicked.addClass('eea-active-accordion').find('.eea-accordion-content').slideDown();
        }
    });
});
