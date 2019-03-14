/* jslint:disable */
/*global jQuery, window, _, document */

/* EXTERNAL DEPENDENCIES eea-accordion.js
 * responsive design transforms done to tabs and global header
 * and footer
 * eg:https://www.eea.europa.eu/code/design-elements#tab-first-tab
 * */

// NOTE: this file is loaded by PLONE 3 sites as such avoid using
// jQuery features above 1.4 such as on instead of bind

jQuery(document).ready(function($) {

    if (!window.EEA) {
        window.EEA = {};
    }
    var $body = $('body');
    window.EEA.isPrintPdf = $body.hasClass('body-print');
    var underscore = window._;

    var throttle = window.underscore ? window.underscore.throttle : function (t, e) {
        var n;
        return function () {
            var i, o = this, r = arguments;
            n || (i = function () {
                n = null, t.apply(o, r)
            }, n = window.setTimeout(i, e))
        }
    };

    //var $tabbed_menu = $(".tabbedmenu");
    //var tabbed_menu_found = $tabbed_menu.length;
    // #27215 disable accordion transform of the tabbed menu, since it's a server side transform
    // and the accordion expects the panels to already have content and ignore the link from the
    // header the content would never be reachable. To be enabled after work is done in eunis side
    // or we enhance the accordion to have a server side accordion as well
    var $tabbed_menu;
    var tabbed_menu_found = false;
    var $eea_tabs_with_arrows = $('.eea-tabs-arrows'),
        eea_tabs_with_arrows_found = $eea_tabs_with_arrows.length;
    function escapeRegExp(string) {
        return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
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
            css = tabbed_menu_found ? replaceAll(css, 'tabbedmenu-panel', 'eea-accordion-panels tabbed-accordion-menu') : css;
            $tabs_panel.attr('class', css);
        }
        $tabs_panel.addClass('collapsed-by-default eea-tabs-transformed');
        var $tabs_panels = $tabs_panel.find('.eea-tabs-panel');

        var $tabs_tabs = $tab.find('li');
        $("#topic-selector").hide();
        $tabs_tabs.each(function(idx, el) {
            var $panel = $tabs_panels.eq(idx);
            var $el = $(el);
            var link = $el.find('a')[0];
            $panel.attr('class', 'eea-accordion-panel');
            if (!$panel.find('.pane').length) {
                $panel.wrapInner("<div class='pane' />");
            }
            $panel.find('.filter-topic').hide();
            $panel.show();
            var $accordion_title = $panel.find('.eea-accordion-title');
            var link_is_current = link.className.indexOf('current') !== -1;
            if ($accordion_title.length) {
                if (link_is_current && !$accordion_title.hasClass('current')) {
                    $tabs_panels.find('.pane').hide();
                    $accordion_title.click();
                }
                return;
            }
            var $result = $('<h2 />', {
                'class': (link && link.className.indexOf('current') !== -1) ? 'eea-accordion-title current' : 'eea-accordion-title',
                id: link ? link.id : '',
                html: link.innerHTML || el.innerHTML
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
        var $tabs_accordion = $('.eea-tabs-transformed');
        if (!$tabs_accordion.length) {
            return;
        }
        $tabs_accordion.each(function(idx, item) {
            var $item = $(item);
            var css = $item.attr('class');
            if (css) {
                css = tabbed_menu_found ?
                    replaceAll(css, 'eea-accordion-panels tabbed-accordion-menu', 'tabbedmenu-panel') : css;
                css = replaceAll(css, 'eea-accordion-panels', 'eea-tabs-panels');
                $item.attr('class', css);
            }
            $item.removeClass('collapsed-by-default eea-tabs-transformed');
            var $tabs_accordions = $item.find('.eea-accordion-panel');
            $("#topic-selector").show();
            $tabs_accordions.each(function(idx, panel) {
                var $panel = $(panel);
                $panel.find('.filter-topic').show();
                var $parent = $panel.closest('.eea-tabs-panels');
                var $tabs = $parent.hasClass('eea-tabs-panels-soer') ? $('.eea-tabs-soer') : $panel.parent().prev() ;
                $panel.attr('class', 'eea-tabs-panel');
                if ($('h2.current', $panel).length) {
                    $tabs.find('a').removeClass('current').eq(idx).addClass('current').click();
                    $panel.show();
                } else {
                    $panel.hide();
                }
            });
        });
        $('.js-eea-tabs-to-hide').removeClass('hidden');
    }

    var $buttonnavbar = $('button.navbar-toggle');
    var $soer_tabs = $('.eea-tabs-soer'),
        $soer_tabs_found = $soer_tabs.length;
    var $notransform = $('.eea-tabs-arrows, .eea-tabs-soer');
    if (underscore && underscore.debounce) {
        $(window).resize(_.debounce(function() {
            var $tabs = $('.eea-tabs').not($notransform);
            var tabs_found = $tabs.length;
            $(window).trigger('eea_debounced_resize');
            if ($buttonnavbar.css('display') !== 'none') {
                if (tabs_found) {
                    $tabs.each(function(idx, tab) {
                        var $tab = $(tab);
                        var $tab_panels = $tab.next('.eea-tabs-panels');
                        $tab_panels = $tab_panels.length ? $tab_panels : $tab.parent().find('.eea-tabs-panels');
                        make_tabs_into_accordions($tab, $tab_panels);
                    });
                }
                if (tabbed_menu_found) {
                    make_tabs_into_accordions($tabbed_menu.find('ul'), $('.tabbedmenu-panel'));
                }
                if (eea_tabs_with_arrows_found) {
                    make_tabs_into_accordions($eea_tabs_with_arrows, $('.eea-tabs-panels-arrows'));
                }
                if ($soer_tabs_found) {
                    make_tabs_into_accordions($soer_tabs, $('.eea-tabs-panels-soer'));
                }

            } else {
                if ($soer_tabs || $eea_tabs_with_arrows) {
                    make_accordions_into_tabs();
                }
                // turn tabs into accordions if tabs span over two rows
                $tabs.each(function(idx, tab) {
                    var $tab = $(tab);
                    var $tab_panels = $tab.next('.eea-tabs-panels');
                    var tabs_multiple_lines = false;
                    $tab_panels = $tab_panels.length ? $tab_panels : $tab.parent().find('.eea-tabs-panels');
                    var tabs_first_offset = 0;
                    if ($tab.hasClass('hidden')) {
                        $tab.removeClass('hidden');
                    }
                    $tab.find('li').each(function(idx, el) {
                        if (idx === 0) {
                            tabs_first_offset = el.offsetTop;
                        }
                        if (el.offsetTop !== tabs_first_offset) {
                            tabs_multiple_lines = true;
                            return false;
                        }
                    });
                    if (tabs_multiple_lines) {
                        $tab.addClass('hidden');
                        make_tabs_into_accordions($tab, $tab_panels);
                    }

                });
            }
        }, 500));
    }

    $(window).trigger('resize');

    // insert the logo also on the navbar for the bootstrap menu
    // this ensures that switching from portrait to landscape is without any flash since
    // we can show and hide with css
    var $navbar_header = $('.navbar-header');
    var $portal_logo_link = $('#portal-logo-link');
    if (!$navbar_header.children('#portal-logo-link-header').length) {
        $portal_logo_link.clone().attr('id', 'portal-logo-link-header').prependTo($navbar_header);
    }

    // make accordions out of the left and right areas of faceted navigation pages
    var $faceted_left_column = $('#faceted-left-column').addClass('eea-accordion-panels collapsed-by-default non-exclusive');
    var $faceted_right_column = $('#faceted-right-column').addClass('eea-accordion-panels collapsed-by-default non-exclusive');
    $faceted_left_column.find('.faceted-widget').addClass('widget-fieldset').appendTo($faceted_right_column);
    $faceted_right_column.find('.faceted-widget').addClass('widget-fieldset').each(function(idx, el) {
        var $el = $(el);
        $el.addClass('eea-accordion-panel');
        var $children = $el.wrapInner('<div class=\'pane\' />');
        var $legend = $children.find('legend');
        var $h2 = $('<h2 />', {'html': $legend.text(), 'class': 'eea-accordion-title eea-icon-right-container'});
        $h2.prependTo($el);
    });

    window.setTimeout(function() {
        $('.eea-right-section-slider').find('.eea-icon').removeClass('animated');
    }, 5000);

  // add eea-right-section to the right area
  $('#right-area').addClass('eea-section eea-right-section');

    var $faceted_text_widget = $(".faceted-text-widget");
  $("<div class='faceted-textwidget-place-current'><a href='#' class='eea-faceted-filter eea-section-trigger eea-section-trigger-right'>Filter »</a></div>").appendTo($faceted_text_widget.find("form"));
  $('.eea-section-trigger').click(function(e) {
        e.preventDefault();
    var section = e.target.className.indexOf('trigger-right') ? '.eea-right-section' : '.eea-left-section';
    $(section).prev().click();
    });

    // 29865 open faceted menus when sliding left and right or when clicking on gray area
    function swipeHandler(ev) {
        var left_direction = ev.swipestart.coords[0] > ev.swipestop.coords[0];
        var $faceted_slider = $(".eea-right-section-slider"),
            faceted_slider_is_active = $faceted_slider.hasClass("eea-right-section-slider-active"),
            slider_length = $faceted_slider.length;
        if (slider_length) {
            if (left_direction && faceted_slider_is_active ||
                !left_direction && !faceted_slider_is_active) {
                return;
            }

            // if swipe takes longer than 75msec than it can be categorized as a
            // swipe to see content if you are zoomed in
            var time =  ev.swipestop.time - ev.swipestart.time;

            //$faceted_slider.next().find(".eea-accordion-title").eq(0).text(time);
            $faceted_slider.removeClass("is-eea-hidden");
            // initiate a scroll event in order to display the navbar and
            // eea-right-section-slider if they are hidden and we are swiping
            // to show the filter menus
            $(window).scroll();

            // swipe timing happens a lot faster on Iphone then on Android
            // as such we need to check for different maximum timings
            if (window.navigator.userAgent.indexOf('iPhone') !== -1) {
                if (time > 60) {
                    return;
                }
            } else {
                if (time > 150) {
                    return;
                }
            }

            $faceted_slider.find('.eea-icon').click();
        }
    }

    $(window).bind("swipe", swipeHandler);

    var mqOrientation = window.matchMedia && window.matchMedia('(orientation: portrait)');
    // The Listener will fire whenever this either matches or ceases to match
    if (!mqOrientation) {
        return;
    }

    // 68250 make Interactive Maps iframe span full screen height on load and when changing
    // orientation
    var $gis_application = $(".portaltype-gis-application");
    var $gis_iframe, gis_iframe_resize;
    if ($gis_application) {
        $gis_iframe = $gis_application.find("iframe");
        if ($gis_iframe) {
            gis_iframe_resize = function() {
                var window_height = $(window).height();
                if ($gis_iframe.height() !== window_height) {
                    $gis_iframe.css('height', window_height - 50);
                }
            };
            gis_iframe_resize();
            mqOrientation.addListener(function() {
                gis_iframe_resize();
            });
        }
    }

    // add any cross_site_top panels as siteaction panels
    var $parent = $("#js-siteaction-panels");
    var make_siteaction_panel = function($content, $parent, panel_id, use_only_children) {
        var $panel = $("<div class='panel' id='" + panel_id + "'>" +
            "<div class='panel-top'></div>" +
            "<div class='panel-content shadow'>" +
            "</div>");
        var $clone = $content.clone();
        if (use_only_children) {
            $clone = $clone.children();
        }
        $clone.appendTo($panel.find('.panel-content'));
        $panel.appendTo($parent);
    };
    make_siteaction_panel($("#portal-personaltools"), $parent, 'tip-siteaction-user-menu', true);

    // make accordion panels out of cross-site-top content
    var $holder = $('<div class=\'eea-accordion-panels collapsed-by-default non-exclusive\' />');

    function turn_cross_panels_into_accordions($el, $holder) {
        var lists = $el.find('> li');
        lists.each(function(idx, el) {
            var $acordion_panel = $('<div  />',
                {id: 'eap-' + el.id, 'class': 'eea-accordion-panel'});
            var $el = $(el);
            var $old_panel = $('#tip-' + el.id);
            var $panel = $('<div />', {
                'class': 'pane',
                html: $old_panel.find('.panel-content').html()
            });
            var $result = $('<h2 />', {
                'class': 'eea-icon-right-container',
                html: $el.find('a').attr('title')
            });
            $result.appendTo($acordion_panel);
            $panel.appendTo($acordion_panel);
            $acordion_panel.appendTo($holder);
        });
    }
    var $secondary_portaltabs_modified = $('#secondary-portaltabs');


    if (!$secondary_portaltabs_modified.find('.eea-accordion-panels').length) {
        $holder.prependTo($secondary_portaltabs_modified);
        (function() {
            var $cross_site_top_panels = $($secondary_portaltabs_modified);
            $cross_site_top_panels.each(function(idx, el) {
                var $el = $(el);
                turn_cross_panels_into_accordions($el, $holder);
            });
        })();
    }

    /* #27280 return only if we don't have a mobile resolution as well as a larger resolution */
    var mobile_desktop = false;
    var window_height = window.outerHeight || window.innerHeight;
    if (window.innerWidth < 768 && window_height > 768 ||
        window.innerWidth > 768 && window_height < 601) {
        mobile_desktop = true;
    }
    window.eea_mobile_desktop_browser_resolution = mobile_desktop;
    if (window_height >= 600 && window.innerWidth > 767 && !mobile_desktop) {
        return;
    }
    window.eea_mobile_resolution = true;

    // #26378 hide and show eea-scrolling-toggle-visibility when scrolling up or down
    var lastScrollTop = 0;
    var $header_holder = $('#header-holder');
    var $navbar = $header_holder.find('.navbar');
    $navbar.addClass('eea-scrolling-toggle-visibility');
    var multiple_touch = false;
    var navbar_content = $header_holder.find('.navbar-collapse')[0];


    function TouchMove(ev) {
        var e = ev.originalEvent;
        multiple_touch = e.touches.length > 1;
    }

    var lazyTouchMove = throttle(TouchMove, 90);
    $(window).bind("touchmove", lazyTouchMove);

    var $document = $(document);
    var win_height = window.innerHeight;
    var body = document.body;
    function navScroll(ev) {
        // prevent scroll hiding or showing when reaching bottom
        var doc_height = $document.height();
        if(window.scrollY + win_height >= doc_height) {
            return;
        }
        // prevent scroll hiding or showing when reaching top
        var targetScrollY = ev.currentTarget.scrollY;
        if (multiple_touch || (targetScrollY <= 0 || targetScrollY >= doc_height)) {
            return;
        }

        // faceted loading trigger a window scroll as such we need to
        // wait for it to finish before checking for the scroll event
        var faceted = document.querySelectorAll('.faceted-results')[0];
        if (faceted && faceted.style.opacity) {
            return;
        }

        if ($buttonnavbar.css('display') === 'none') {
            return;
        }
        var $keep_visible = $('.eea-scrolling-keep-visible');
        var $items = $('.eea-scrolling-toggle-visibility');
        var st = $(this).scrollTop();
        //var def_class = "navbar navbar-default navbar-fixed-top";
        if (st > lastScrollTop) {
            // downscroll code
            $items.each(function(idx, el) {
                if (el.className.indexOf('is-eea-hidden') === -1 &&
                    navbar_content.className.indexOf('in') === -1) {
                    if (!$keep_visible.length) {
                        el.className += ' is-eea-hidden';
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

    var lazyNavScroll = throttle(navScroll, 100);
    $(window).scroll(lazyNavScroll);

});
