$(document).ready(function() {
    var navTreeCurrentItem = $('.navTreeCurrentItem');
    var openAccordionPortlet = $('.eea-accordion-portlet:first');

    // If the URL ends with 'dc', we open the data center accordion section.
    if (/\/dc$/.test(window.location.pathname)) {
        openAccordionPortlet = $('#portlet-navigation-tree-data-center-services');
    } else if (navTreeCurrentItem) {
        openAccordionPortlet = navTreeCurrentItem.parents('.eea-accordion-portlet');
    }
    openAccordionPortlet.addClass('eea-active-accordion');
    $('.eea-accordion-portlet').not('.eea-active-accordion').find('.eea-accordion-content').hide();

    $('.eea-accordion-header').click(function() {
        var portletClicked = $(this).parent();
        if (!portletClicked.hasClass('.eea-active-accordion')) {
            $('.eea-active-accordion').removeClass('eea-active-accordion').find('.eea-accordion-content').slideUp();
            portletClicked.addClass('eea-active-accordion').find('.eea-accordion-content').slideDown();
        }
    });
});
