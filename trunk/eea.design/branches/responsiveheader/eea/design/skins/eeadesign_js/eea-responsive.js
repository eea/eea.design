/* global jQuery window */
jQuery(document).ready(function($) {

    var window_height = document.documentElement.clientHeight;
    if (window_height >= 600 && window.outerWidth > 767) {
        return;
    }

    var $nav_collapse = $("#bs-example-navbar-collapse-1");
    function setMaxHeight(window_height) {
       $nav_collapse.css('max-height', window_height - 60);
    }
    setMaxHeight(window_height);

    $("#portal-logo-link").prependTo(".navbar-header");
    var $holder = $("<div class='eea-accordion-panels collapsed-by-default non-exclusive' />");
    var $cross_site_top = $("#cross-site-top");
    $("#portal-header").prependTo($("#portal-top"));
    $holder.prependTo($cross_site_top);
    $cross_site_top.insertBefore("#portaltab-abouteea");

    $("#portal-externalsites, #portal-siteactions").each(function accordions(idx, el){
        var $el = $(el);
        var lists = $el.find('li');
        lists.each(function(idx, el){
            var $acordion_panel = $("<div  />",
                {id: el.id, class: 'eea-accordion-panel'});
            var $el = $(el);
            var $old_panel = $("#tip-" + el.id);
            var $panel = $("<div />", {
                class: 'pane',
                html: $old_panel.find('.panel-content').html()});
            var $result = $("<h2 />", {
                class: 'eea-icon-right-container',
                html: $el.find('a').text()});
            $old_panel.remove();
            $result.appendTo($acordion_panel);
            $panel.appendTo($acordion_panel)
            $acordion_panel.appendTo($holder);
        });
        $el.remove();
    });

    var height = function() {
        if (window.navigator.userAgent.indexOf('iPhone') !== -1) {
            return document.documentElement.clientHeight;
        }
        else {
            return window.outerHeight;
        }
    }

    var mqOrientation = window.matchMedia("(orientation: portrait)");
    // The Listener will fire whenever this either matches or ceases to match
    mqOrientation.addListener(function() {
        setMaxHeight(height());
    });

});

