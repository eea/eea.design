/* jslint:disable */
/*global jQuery, window, document, Faceted */

jQuery(document).ready(function($) {
    if (window.Faceted) {
        Faceted.LoadLazy = {
            initialize: function () {
                var results = jQuery('#faceted-results');
                if(results.length) {
                    var loaded_once;
                        var children = results.children();
                        if (children.length) {
                            var lazy_elements = children.find('.lazy');
                            var lazy_elements_parents = lazy_elements.parent();

                            lazy_elements.lazy({
                                scrollDirection: 'both',
                                effect: 'fadeIn',
                                effectTime: 1000,
                                threshold: 100,
                                visibleOnly: true,
                                onError: function(element) {
                                    console.log('error loading ' + element.data('src'));
                                }
                            });

                            lazy_elements.each(function(){
                                var element = jQuery(this);
                                var source = element.attr('src') || element.attr('data-src');

                                if (source.indexOf('ajax-loader') === -1) {
                                    element.attr('data-src', source);
                                    if (this.tagName === "IMG") {
                                        element.attr('src', '/www/++resource++faceted_images/ajax-loader.gif');
                                    }
                                    else {
                                        element.css('background-image', 'url("/www/++resource++faceted_images/ajax-loader.gif")');
                                    }
                                }
                            });
                            lazy_elements.lazy({
                                scrollDirection: 'both',
                                effect: 'fadeIn',
                                effectTime: 1000,
                                threshold: 100,
                                visibleOnly: true,
                                onError: function(element) {
                                    console.log('error loading ' + element.data('src'));
                                }
                            });
                            // 106884 force a click for faceted results
                            // in order to get results to lazy load when
                            // using the related dialog
                            setTimeout(function(){
                                results.click();
                            }, 500);
                        }
                }
            }
        };
        // bind lazy loading upon ajax query success
        function faceted_lazy_init() {
            jQuery(Faceted.Events).bind(Faceted.Events.AJAX_QUERY_SUCCESS, function() {
                Faceted.LoadLazy.initialize();
            });
        }
        faceted_lazy_init();
        // rebind lazy init upon CLEANUP_COMPLETED event needed when clicking on
        // the related edit widget and it's category tabs
        jQuery(Faceted.Events).bind(Faceted.Events.CLEANUP_COMPLETED, function() {
            faceted_lazy_init();
        });
    }

   /* $('#content').find('iframe').each(function() {
        if (isElementInViewport(this) === false) {
            enableLazy(this);
            lazyElements.push(this);
        }
    }); */

    var lazyElements = $('.lazy');
    lazyElements.lazy({
        scrollDirection: 'both',
        effect: 'fadeIn',
        effectTime: 1000,
        threshold: 100,
        visibleOnly: true,
        onError: function(element) {
            console.log('error loading ' + element.data('src'));
        }
    });

    // Internet explorer detection
    var isIe = function detectIE() {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 or older => return true
            return true;
        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 => return true
            return true;
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            // Edge (IE 12+) => return true
            return true;
        }

        // other browser
        return false;
    };

    var count = 0;
    var forceImageLoad = function(images) {
        $(images).each(function() {
            var image = this;
            var src = image.getAttribute('src');
            var data = image.getAttribute('data-src');
            var type = image.tagName;
            // if type isn't img then we have a span with a bg image style
            if (type !== "IMG" && data) {
                src = image.getAttribute('style') || '';
                if (src) {
                    // split the url from background-image: url(url) string
                    src = src.split('url("');
                    if (src.length > 1) {
                        src = src[1].split('")')[0];
                    }
                }
                if (!src || src !== data) {
                    image.style.backgroundImage = "url(" + data + ")";
                }
            }
            if ((src && data)  && src !== data) {
               image.setAttribute('src', data);
            }
        });
    };

    var forceDavizLoad = function() {
        jQuery.each(jQuery('.embedded-dashboard:visible'), function(idx, elem) {
            if ((elem)) {
                if (jQuery(elem).hasClass('not_visible')) {
                    jQuery(elem).removeClass('not_visible');
                    if (jQuery(elem).hasClass('isChart')) {
                        var vhash = elem.id.split('_')[2];
                        if (window.gl_charts) {
                            window.gl_charts['googlechart_view_' + vhash] = window.drawChart(jQuery(elem).data('settings'), jQuery(elem).data('other_options')).chart;
                        }
                    }
                    else{
                        window.drawDashboardEmbed(jQuery(elem).data('settings'));
                    }
                    jQuery(elem).trigger('eea.embed.loaded');
                }
            }
            setTimeout(function() {}, 1000);
        });
    };

    var beforePrintCaller = function(lazyElements) {
        forceDavizLoad();
        forceImageLoad(lazyElements);
    };

    if (typeof lazyElements !== 'undefined') {
        if (isIe()) {
            window.onbeforeprint = beforePrintCaller(lazyElements || []); // Internet Explorer
        }

        $(document).keydown(function(allBrowsers) { // Track printing using Ctrl/Cmd+P.
            if (allBrowsers.keyCode === 80 && (allBrowsers.ctrlKey || allBrowsers.metaKey)) {
                beforePrintCaller(lazyElements || $(".lazy"));
            }
        });

        if (window.matchMedia) { // Track printing from browsers using the Webkit engine
            var mediaQueryList = window.matchMedia('print');
            mediaQueryList.addListener(function(mql) {
                if (mql.matches) {
                    beforePrintCaller(lazyElements || $(".lazy"));
                }
            });
        }
    }
    var $window = $(window);
    $window.on('click', function(ev) { $window.scroll();});
});
