$(document).ready(function() {

    function loadDataCentreOverview() {
        var noHashURL = window.location.href.split('#')[0];
        var themeName = noHashURL.split('/themes/')[1].split('/')[0];
        var themesURL = noHashURL.split('/themes/')[0] + '/themes';
        var themeCentreURL = themesURL + '/' + themeName;
        var dcFolderURL = themeCentreURL + '/dc';

        // If the DC folder is showing, we don't need to do anything
        if (window.location.href == dcFolderURL) {
            return;
        }

        $('#region-content').html('<img src="++resource++faceted_images/ajax-loader.gif" />');
        $.get(dcFolderURL + '/dc_view_main_macro', function(data) {
            $('#region-content').html(data).fadeIn();
            window.location.hash = 'dc';
        }, 'html');
    }

    // Only show content of the active accordion
    var navTreeCurrentItem = $('.navTreeCurrentItem');
    var openAccordionPortlet = $('.eea-accordion-portlet:first');
    if (navTreeCurrentItem) {
        openAccordionPortlet = navTreeCurrentItem.parents('.eea-accordion-portlet');
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

        // Load DC overview with AJAX if the DC section is clicked
        if (portletClicked.attr('id') == 'portlet-navigation-tree-data-center-services') {
            loadDataCentreOverview();
        }
    });

    if (window.location.hash == '#dc') {
        $('#portlet-navigation-tree-data-center-services .eea-accordion-header').click();
    }

});
