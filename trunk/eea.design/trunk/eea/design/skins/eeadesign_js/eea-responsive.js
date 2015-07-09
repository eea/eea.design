/* global jQuery, window, _ */
jQuery(document).ready(function($) {

    var doc = document.documentElement;

    var $logo = $("#portal-logo-link");
    var $logo_holder = $(".portal-logo");
    var $navbar_header = $(".navbar-header");
    function windowResize() {
        var $logo_parent = $logo.parent();
        if (window.outerWidth < 768) {
            if (!$logo_parent.hasClass('navbar-header')) {
                $logo.prependTo($navbar_header);
            }
        }
        else {
            if (!$logo_parent.hasClass('portal-logo')) {
                $logo.appendTo($logo_holder);
            }
        }
    }

    var lazyWindowResize = _.debounce(windowResize, 100);

    $(window).resize(lazyWindowResize);
    var client_height = doc.clientHeight;

    var mobile_desktop = false;
    if (window.innerWidth < 768 && window.innerHeight > 768 ||
        window.innerWidth > 768 && window.innerHeight < 768) {
        mobile_desktop = true;
    }
    /* #27280 return only if we don't have a mobile resolution as well as a larger resolution */
    if (window.outerHeight >= 600 && window.innerWidth > 767 && !mobile_desktop) {
        return;
    }

    var $nav_collapse = $("#bs-example-navbar-collapse-1");
    function setMaxHeight(client_height) {
        $nav_collapse.css('max-height', client_height - 60);
    }
    setMaxHeight(client_height);

    $logo.prependTo($navbar_header);
    var $holder = $("<div class='eea-accordion-panels collapsed-by-default non-exclusive' />");
    var $cross_site_top = $("#cross-site-top");
    //var $cross_site_top_clone = $cross_site_top.clone();
    //window.$cross_site_top_clone = $cross_site_top.clone();
    $("#portal-header").prependTo($("#portal-top"));
    $holder.prependTo($cross_site_top);
    $cross_site_top.insertBefore("#portaltab-abouteea");

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
            $old_panel.remove();
            $result.appendTo($acordion_panel);
            $panel.appendTo($acordion_panel);
            $acordion_panel.appendTo($holder);
        });
        $el.remove();
    }
    $cross_site_top_panels.each(accordions);

    var height = function() {
        // iPhone clientHeight matches better the document height while other
        // devices give better results when using outerHeight
        if (window.navigator.userAgent.indexOf('iPhone') !== -1) {
            return doc.clientHeight;
        }
        else {
            return window.outerHeight;
        }
    };

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

    var mqOrientation = window.matchMedia && window.matchMedia("(orientation: portrait)");
    // The Listener will fire whenever this either matches or ceases to match
    if (!mqOrientation) {
        return;
    }
    mqOrientation.addListener(function() {
        setMaxHeight(height());
    });

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


