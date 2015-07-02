/* global jQuery window */
jQuery(document).ready(function($) {

    var window_height = document.documentElement.clientHeight;
    if (window_height >= 600 && window.innerWidth > 767) {
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

    var $soer_panel = $(".eea-tabs-panels-soer");
    $soer_panel.attr('class', 'eea-accordion-panels eea-accordion-panels-soer collapsed-by-default non-exclusive');
    var $soer_panels = $soer_panel.find('.eea-tabs-panel');

    var $soer_tab = $(".eea-tabs-soer");
    var $soer_tabs = $soer_tab.find('li');
    $soer_tabs.each(function(idx, el){
       var $panel = $soer_panels.eq(idx);
        var $el  = $(el);
        var link = $el.find('a')[0];
        $panel.attr('class', 'eea-accordion-panel');
        $panel.wrapInner("<div class='pane' />");
        var $result = $("<h2 />", {
            class: 'eea-icon-right-container',
            id: link.id,
            html: link.innerHTML});
        $result.prependTo($panel);
    });
    $soer_tab.remove();

    var mqOrientation = window.matchMedia("(orientation: portrait)");
    // The Listener will fire whenever this either matches or ceases to match
    mqOrientation.addListener(function() {
        setMaxHeight(height());
    });

});

