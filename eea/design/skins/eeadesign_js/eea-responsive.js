/* global jQuery, window, _, document */
jQuery(document).ready(function($) {
    var doc = document.documentElement;
    // #16878 move last two links of globalnav to a secondary container
    // #23500 we now have an extra list item (europe)
    var $secondary_portaltabs = $("<ul id='secondary-portaltabs'></ul>"),
        global_nav = $('#portal-globalnav'),
        global_nav_children = global_nav.children(),
        $secondary_nav_items = global_nav_children.slice(global_nav_children.length - 3);
    $secondary_nav_items.wrapAll($secondary_portaltabs);

    function escapeRegExp(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    }

    function replaceAll(string, find, replace) {
        return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
    }

    function make_tabs_into_accordions($tab, $tabs_panel) {
        if (!$tabs_panel.length) {
            return;
        }
        var css = $tabs_panel.attr('class');
        if (css) {
            css = replaceAll(css, 'eea-tabs-panels', 'eea-accordion-panels');
            css = replaceAll(css, 'tabbedmenu-panel', 'eea-accordion-panels tabbed-accordion-menu');
            $tabs_panel.attr('class', css);
        }
        $tabs_panel.addClass('collapsed-by-default eea-tabs-transformed');
        var $tabs_panels = $tabs_panel.find('.eea-tabs-panel');

        var $tabs_tabs = $tab.find('li');
        $tabs_tabs.each(function(idx, el) {
            var $panel = $tabs_panels.eq(idx);
            var $el = $(el);
            var link = $el.find('a')[0];
            $panel.attr('class', 'eea-accordion-panel').show();
            $panel.wrapInner("<div class='pane' />");
            var $result = $("<h2 />", {
                'class': (link && $(link).hasClass('current')) ? 'accordion-header-tab current' : 'accordion-header-tab',
                id: link ? link.id : '',
                html: el.innerHTML
            });
            $result.append('<span class="eea-icon eea-icon-right"></span>');
            $result.prependTo($panel);
        });
        $tab.addClass('js-eea-tabs-to-hide hidden');
        if (window.EEA && window.EEA.eea_accordion) {
            window.EEA.eea_accordion($tabs_panel);
        }
    }

    function make_accordions_into_tabs() {
        var $tabs_accordion = $(".eea-tabs-transformed");
        if (!$tabs_accordion.length) {
            return;
        }
        $tabs_accordion.each(function(idx, item) {
            var $item = $(item);
            var css = $item.attr('class');
            if (css) {
                css = replaceAll(css, 'eea-accordion-panels tabbed-accordion-menu', 'tabbedmenu-panel');
                css = replaceAll(css, 'eea-accordion-panels', 'eea-tabs-panels');
                $item.attr('class', css);
            }
            $item.removeClass('collapsed-by-default eea-tabs-transformed');
            var $tabs_accordions = $item.find('.eea-accordion-panel');

            $tabs_accordions.each(function(idx, panel) {
                var $panel = $(panel);
                $panel.attr('class', 'eea-tabs-panel');
                if ($('h2.current', $panel).length) {
                    $panel.show();
                } else {
                    $panel.hide();
                }
                $panel.html($('.pane', $panel).html());
            });
        });
        $(".js-eea-tabs-to-hide").removeClass('hidden');
    }

    var $buttonnavbar = $('button.navbar-toggle');
    var $notransform = $('.eea-tabs-panels-arrows, .eea-tabs-panels-soer, #whatsnew-gallery');
    $(window).resize(_.debounce(function() {
        if ($buttonnavbar.css('display') !== 'none') {
            var $tabs_panel = $(".eea-tabs-panels").not($notransform);
            if ($tabs_panel.length > 0) {
                $tabs_panel.each(function(idx, tab_panel) {
                    var $tab_panel = $(tab_panel);
                    make_tabs_into_accordions($tab_panel.prev('.eea-tabs'), $tab_panel);
                });
            }
            make_tabs_into_accordions($('.tabbedmenu ul'), $('.tabbedmenu-panel'));
            make_tabs_into_accordions($('.eea-tabs-arrows'), $('.eea-tabs-panels-arrows'));
        }
        else {
            make_accordions_into_tabs();
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
    var window_height = window.outerHeight || window.innerHeight;
    if (window.innerWidth < 768 && window_height > 768 ||
        window.innerWidth > 768 && window_height < 768) {
        mobile_desktop = true;
    }
    window.mobile_desktop_browser_resolution = mobile_desktop;
    if ( window_height >= 600 && window.innerWidth > 767 && !mobile_desktop) {
        return;
    }


    // make accordions out of the left and right areas of faceted navigation pages
    var $faceted_left_column = $("#faceted-left-column").addClass("eea-accordion-panels collapsed-by-default non-exclusive");
    var $faceted_right_column = $("#faceted-right-column").addClass("eea-accordion-panels collapsed-by-default non-exclusive");
    $faceted_left_column.find(".faceted-widget").appendTo($faceted_right_column);
    $faceted_right_column.find(".faceted-widget").each(function(idx, el) {
        var $el = $(el);
        $el.addClass('eea-accordion-panel');
        var $children = $el.wrapInner("<div class='pane' />");
        var $legend = $children.find("legend");
        var $h2 = $("<h2 />", {"html": $legend.text(), "class": "eea-accordion-title eea-icon-right-container"});
        $h2.prependTo($el);
        $legend.remove();
    });


    // WIP code for faceted navigation
    window.setTimeout(function() {
        $(".eea-icon-caret-left").removeClass("animated");
    }, 5000);


    var $right_area = $("#right-area").addClass("eea-section eea-right-section");

    $("<a href='#' class='pull-right eea-faceted-filter'>Filter »</a>").appendTo(".faceted-text-widget");
    $(".eea-faceted-filter").click(function(e) {
        e.preventDefault();
        $right_area.prev().click();
    });
    // END WIP code for faceted navigation


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
        lists.each(function(idx, el) {
            var $acordion_panel = $("<div  />",
                {id: el.id, 'class': 'eea-accordion-panel'});
            var $el = $(el);
            var $old_panel = $("#tip-" + el.id);
            var $panel = $("<div />", {
                'class': 'pane',
                html: $old_panel.find('.panel-content').html()
            });
            var $result = $("<h2 />", {
                'class': 'eea-icon-right-container',
                html: $el.find('a').text()
            });
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
    $soer_tabs.each(function(idx, el) {
        var $panel = $soer_panels.eq(idx);
        var $el = $(el);
        var link = $el.find('a')[0];
        $panel.attr('class', 'eea-accordion-panel');
        $panel.wrapInner("<div class='pane' />");
        var $result = $("<h2 />", {
            class: 'eea-icon-right-container',
            id: link.id,
            html: link.innerHTML
        });
        $result.prependTo($panel);
    });
    $soer_tab.remove();

    // #26378 hide and show eea-scrolling-toggle-visibility when scrolling up or down
    var lastScrollTop = 0;
    var $header_holder = $("#header-holder");
    var $navbar = $header_holder.find('.navbar');
    $navbar.addClass("eea-scrolling-toggle-visibility");

    var navbar_content = $header_holder.find(".navbar-collapse")[0];

    function navScroll() {
        // faceted loading trigger a window scroll as such we need to
        // wait for it to finish before checking for the scroll event
        var faceted = document.querySelectorAll('.faceted-results')[0];
        if (faceted && faceted.style.opacity) {
            return;
        }
        var $keep_visible = $(".eea-scrolling-keep-visible");
        var $items = $(".eea-scrolling-toggle-visibility");
        var st = $(this).scrollTop();
        //var def_class = "navbar navbar-default navbar-fixed-top";
        if (st > lastScrollTop) {
            // downscroll code
            $items.each(function(idx, el) {
                if (el.className.indexOf("is-eea-hidden") === -1 &&
                    navbar_content.className.indexOf("in") === -1) {
                    if (!$keep_visible.length) {
                        el.className += " is-eea-hidden";
                    }
                }
            });
        } else {
            // upscroll code
            $items.each(function(idx, el) {
                if (el.className.indexOf('is-eea-hidden') !== -1) {
                    el.className = el.className.substr(0, el.className.length - 14);
                }
            });
        }
        lastScrollTop = st;
    }

    var lazyNavScroll = _.throttle(navScroll, 10);
    $(window).scroll(lazyNavScroll);

});


