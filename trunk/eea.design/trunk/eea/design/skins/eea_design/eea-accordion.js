$(document).ready(function() {

    // The following URL code crashes if 'themes' is not in URL
    if (!$('body').hasClass('section-themes')) {
        return;
    }

    var noHashURL = window.location.href.split('#')[0];
    var themeName = noHashURL.split('/themes/')[1].split('/')[0];
    var themesURL = noHashURL.split('/themes/')[0] + '/themes';
    var themeCentreURL = themesURL + '/' + themeName;
    var dcFolderURL = themeCentreURL + '/dc';

    // Locate the accordion content (See #3308).
    $('.eea-accordion-portlet').children('dd').not('.exclude-from-eea-accordion').addClass('eea-accordion-content');

    // Only show content of the active accordion
    var navTreeCurrentItem = $('.navTreeCurrentItem');
    var openAccordionPortlet = $('.eea-accordion-portlet:first');
    if (navTreeCurrentItem) {
        openAccordionPortlet = navTreeCurrentItem.parents('.eea-accordion-portlet');
    } else if (window.location.href == dcFolderURL) {
        openAccordionPortlet = $('#portlet-navigation-tree-data-center-services');
    }
    openAccordionPortlet.addClass('eea-active-accordion');
    $('.eea-accordion-portlet').not('.eea-active-accordion').find('.eea-accordion-content').hide();

    // Open accordion menu when clicked
    $('.eea-accordion-header').click(function() {
        var portletHeaderClicked = $(this);
        var portletClicked = $(this).parent();
        if (portletClicked.hasClass('.eea-active-accordion')) {
            return;
        }

        // Show the new accordion section and scroll the page if the content
        // does not fit in the viewport.
        $('.eea-active-accordion').removeClass('eea-active-accordion').find('.eea-accordion-content').slideUp();
        portletClicked.addClass('eea-active-accordion').find('.eea-accordion-content').slideDown("normal", function() {
            var y = portletHeaderClicked.offset().top;
            if ($(window).scrollTop() > y) {
                $('html,body').animate({scrollTop: y}, 1000);
            }
        });

        // Load DC overview with when the DC section is clicked
        if (portletClicked.attr('id') == 'portlet-navigation-tree-data-center-services') {
            if (window.location.href == dcFolderURL) {
                return;
            }
            window.location.href = dcFolderURL;
        }
    });
    

});
