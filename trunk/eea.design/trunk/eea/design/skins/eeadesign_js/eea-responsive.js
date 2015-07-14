/* global jQuery, window, _ */
jQuery(document).ready(function($) {
    var doc = document.documentElement;

    function escapeRegExp(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function replaceAll(string, find, replace) {
        return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    function make_toaccordion(tab, tabs_panel){
        if (tabs_panel.length){
            var css = tabs_panel.attr('class');
            if (css){
                css = replaceAll(css, 'eea-tabs-panels', 'eea-accordion-panels');
                css = replaceAll(css, 'tabbedmenu-panel', 'eea-accordion-panels tabbed-accordion-menu');
                tabs_panel.attr('class', css);
            }
            tabs_panel.addClass('collapsed-by-default eea-tabs-transformed');
            var $tabs_panels = tabs_panel.find('.eea-tabs-panel');

            var $tabs_tabs = tab.find('li');
            $tabs_tabs.each(function(idx, el){
                var $panel = $tabs_panels.eq(idx);
                var $el  = $(el);
                var link = $el.find('a')[0];
                $panel.attr('class', 'eea-accordion-panel').show();
                $panel.wrapInner("<div class='pane' />");
                var $result = $("<h2 />", {
                    'class': (link && $(link).hasClass('current')) ? 'accordion-header-tab current' : 'accordion-header-tab',
                    id: link ? link.id : '',
                    html: el.innerHTML});
                $result.append('<span class="eea-icon eea-icon-right"></span>');
                $result.prependTo($panel);
            });
            tab.addClass('tabbing-hide');
                if (typeof window.EEA.eea_accordion !== "undefined"){
                    window.EEA.eea_accordion(tabs_panel);
                }
        }
    }

    function make_totabs(){
        var $tabs_accordion = $(".eea-tabs-transformed");
        if ($tabs_accordion.length > 0){
            $tabs_accordion.each(function(idx, item){
                var $item = $(item);
                var css = $item.attr('class');
                if (css){
                    css = replaceAll(css, 'eea-accordion-panels tabbed-accordion-menu', 'tabbedmenu-panel');
                    css = replaceAll(css, 'eea-accordion-panels', 'eea-tabs-panels');
                    $item.attr('class', css);
                }
                $item.removeClass('collapsed-by-default eea-tabs-transformed');
                var $tabs_accordions = $(item).find('.eea-accordion-panel');

                $tabs_accordions.each(function(idx, panel){
                    var $panel  = $(panel);
                    $panel.attr('class', 'eea-tabs-panel');
                    if($('h2.current', $panel).length){
                        $panel.show();
                    } else{
                        $panel.hide();
                    }
                    $panel.html($('div.pane', $panel).html());
                });
            });
            $(".tabbing-hide").removeClass('tabbing-hide');
        }
    }

    var $buttonnavbar = $('button.navbar-toggle');
    var $notransform = $('.eea-tabs-panels-arrows, .eea-tabs-panels-soer, #whatsnew-gallery');
    $(window).resize(_.debounce(function() {
        if ($buttonnavbar.css('display') != 'none'){
            var $tabs_panel = $(".eea-tabs-panels").not($notransform);
            if ($tabs_panel.length > 0){
                $tabs_panel.each(function(idx, tab_panel){
                    var $tab_panel  = $(tab_panel);
                    make_toaccordion($tab_panel.prev('.eea-tabs'), $tab_panel);
                });
            }
            make_toaccordion($('.tabbedmenu ul'), $('.tabbedmenu-panel'));
            make_toaccordion($('.eea-tabs-arrows'), $('.eea-tabs-panels-arrows'));
        } else {
            make_totabs();
        }
    }, 500));

    $(window).trigger('resize');

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

    var $faceted_left_column = $("#faceted-left-column").addClass("eea-accordion-panels collapsed-by-default non-exclusive");
    var $faceted_right_column = $("#faceted-right-column").addClass("eea-accordion-panels collapsed-by-default non-exclusive");
    $faceted_left_column.find(".faceted-widget").add($faceted_right_column.find(".faceted-widget")).each(function(idx, el){
        var $el = $(el);
        $el.addClass('eea-accordion-panel');
        var $children = $el.wrapInner("<div class='pane' />");
        var $legend = $children.find("legend");
        var $h2 = $("<h2 />", {"html": $legend.text(), "class": "eea-icon-right-container"});
        $h2.prependTo($children);
        $legend.remove();
    });

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
                {id: el.id, 'class': 'eea-accordion-panel'});
            var $el = $(el);
            var $old_panel = $("#tip-" + el.id);
            var $panel = $("<div />", {
                'class': 'pane',
                html: $old_panel.find('.panel-content').html()});
            var $result = $("<h2 />", {
                'class': 'eea-icon-right-container',
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


