jQuery(function($) {
    // #17037 hide right column and have portal-column be full screen on history
    // and versioning diff pages
    var current_url = window.location.href;
    if ( current_url.indexOf('versions_history_form') !== -1 ||
         current_url.indexOf('version_diff') !== -1 ||
         current_url.indexOf('@@history') !== -1 ) {
        $("#portal-column-content").attr('class', 'cell width-full position-0');
        $("#portal-column-two").hide();
    }
});
