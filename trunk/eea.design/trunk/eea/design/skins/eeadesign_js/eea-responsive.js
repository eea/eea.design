/* global jQuery, window, _ */
jQuery(document).ready(function($) {
    var doc = document.documentElement;


    // insert the logo also on the navbar for the bootstrap menu
    // this ensures that switching from portrait to landscape is without any flash since
    // we can show and hide with css
    var $navbar_header = $(".navbar-header");
    $("#portal-logo-link").clone().attr('id', 'portal-logo-link-header').prependTo($navbar_header);


    /* #27280 return only if we don't have a mobile resolution as well as a larger resolution */
    var mobile_desktop = false;
    if (window.innerWidth < 768 && window.innerHeight > 768 ||
        window.innerWidth > 768 && window.innerHeight < 768) {
        mobile_desktop = true;
    }
    window.mobile_desktop_browser_resolution = mobile_desktop;
    if (window.outerHeight >= 600 && window.innerWidth > 767 && !mobile_desktop) {
        return;
    }


    // adjust navigation height when switching between orientation modes
    var $nav_collapse = $("#bs-example-navbar-collapse-1");
    var client_height = doc.clientHeight;
    function setMaxHeight(client_height) {
        $nav_collapse.css('max-height', client_height - 60);
    }
    setMaxHeight(client_height);

    function height() {
        // iPhone clientHeight matches better the document height while other
        // devices give better results when using outerHeight
        if (window.navigator.userAgent.indexOf('iPhone') !== -1) {
            return doc.clientHeight;
        }
        else {
            return window.outerHeight;
        }
    }
    var mqOrientation = window.matchMedia && window.matchMedia("(orientation: portrait)");
    // The Listener will fire whenever this either matches or ceases to match
    if (!mqOrientation) {
        return;
    }
    mqOrientation.addListener(function() {
        setMaxHeight(height());
    });


    // make accordion panels out of cross-site-top content
    var $holder = $("<div class='eea-accordion-panels collapsed-by-default non-exclusive' />");
    $holder.prependTo($("#secondary-portaltabs"));

    var $cross_site_top_panels = $("#portal-externalsites, #portal-siteactions");
    function accordions(idx, el) {
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
            $result.appendTo($acordion_panel);
            $panel.appendTo($acordion_panel);
            $acordion_panel.appendTo($holder);
        });
    }
    $cross_site_top_panels.each(accordions);


    // make accordion-panels out of soer2015 tabs
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
            html: link.innerHTML});
        $result.prependTo($panel);
    });
    $soer_tab.remove();


    // #26378 hide and show navbar on scroll up and down
    var lastScrollTop = 0;
    var $header_holder = $("#header-holder");
    var navbar = $header_holder.find('.navbar')[0];
    var navbar_content = $header_holder.find(".navbar-collapse")[0];

    function navScroll() {
        var st = $(this).scrollTop();
        var def_class = "navbar navbar-default navbar-fixed-top";
        if (st > lastScrollTop){
            // downscroll code
            if (navbar.className.indexOf("navbar-hidden") === -1  && navbar_content.className.indexOf("in") === -1) {
                navbar.className = "navbar navbar-default navbar-fixed-top navbar-hidden";
            }
        } else {
            // upscroll code
            if (navbar.className !== def_class) {
                navbar.className = def_class;
            }
        }
        lastScrollTop = st;
    }

    var lazyNavScroll = _.debounce(navScroll, 100);
    $(window).scroll(lazyNavScroll);

});


