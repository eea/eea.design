$(document).ready(function() {

    function loadDataCentreOverview() {
        var themeName = window.location.href.split('/themes/')[1].split('/')[0];
        var themesURL = window.location.href.split('/themes/')[0] + '/themes';
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
        var portletClicked = $(this).parent();
        if (portletClicked.hasClass('.eea-active-accordion')) {
            return;
        }

        $('.eea-active-accordion').removeClass('eea-active-accordion').find('.eea-accordion-content').slideUp();
        portletClicked.addClass('eea-active-accordion').find('.eea-accordion-content').slideDown();
        $('html,body').animate({scrollTop: 0}, 1000);

        // Load DC overview with AJAX if the DC section is clicked
        if (portletClicked.attr('id') == 'portlet-navigation-tree-data-center-services') {
            loadDataCentreOverview();
        }
    });

    if (window.location.hash == '#dc') {
        $('#portlet-navigation-tree-data-center-services .eea-accordion-header').click();
    }

});
