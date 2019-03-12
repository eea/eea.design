/*global jQuery window document ga setTimeout*/

// Matomo support
var _paq = _paq || [];

jQuery(document).ready(function($) {
    'use strict';
    var $viewlet_below_content = $("#viewlet-below-content");
    var $content = $("#content");
    var $content_core = $("#content-core");
    var $column_area = $(".column-area");
    var $body = $("body");
    var is_anon = $body.hasClass('userrole-anonymous');
    // #71710 move related and socialmedia inside
    // faceted center area
    var $center_bottom_area = $("#center-bottom-area");
    var $related_items = $("#relatedItems");
    var $socialmedia = $("#socialmedia-viewlet");
    $related_items.appendTo($column_area);
    $socialmedia.appendTo($column_area);
    var appendTo = function(context, target) {
        if (context.length) {
            context.appendTo(target);
        }
    };

    appendTo($related_items, $column_area);
    appendTo($socialmedia, $column_area);
    if ($column_area.length) {
        appendTo($viewlet_below_content, $column_area);
    }
    else {
        appendTo($viewlet_below_content, $content);
    }
    appendTo($related_items, $center_bottom_area);
    appendTo($socialmedia, $center_bottom_area);

    // hide element if empty or has less than on equal to given
    // child length
    var hide_empty_container = function($el, child_count, $checked_el) {
        var count = child_count || 0;
        var $elem = $checked_el || $el;
        var $children = $elem.children();
        if ($children.length <= count) {
            $el.hide();
        }
    };
    hide_empty_container($("#plone-document-byline"), 1);
    hide_empty_container($viewlet_below_content, 0);
    var $whatsnew_listing = $(".whatsnew-listing");
    var $body_content = $(".body-content");
    hide_empty_container($whatsnew_listing, 0, $whatsnew_listing.find('.eea-tabs-panels'));
    hide_empty_container($body_content, 1, $body_content.find('p'));

    var url_path_name = window.location.pathname;
    var $code_diff = $("#diffstylecode");
    if ($body.hasClass("portaltype-sparql") && $code_diff) {
        $code_diff.click();
    }

    var $popup_login = $("#popup_login_form").click(function(e) {
        e.stopPropagation();
    });

    // custom requirement to swap placement of the table and fiche-summary
    // for briefings found within the airs section
    var air_fiches = $(".portaltype-fiche.section-airs");
    if (air_fiches.length) {
        (function() {
            var $fiche_body = $(".fiche-body");
            var $table = $fiche_body.find('table').eq(0);
            var $fiche_summary = $(".fiche-summary");

            if (!$body.hasClass('section-airs subsection-2016')) {
                // hide fiche-summary in case the contents of keyfact is empty
                if (!$fiche_summary.find('.keyFact').find('div').text().trim()) {
                    $fiche_summary.addClass('hidden');
                }
            } else if ($table.length) {
                $table.insertBefore($fiche_summary);
            }

            // hide googlecharts bottom images
            if ($body.hasClass('body-print')) {
                var $iframes = $fiche_body.find('iframe');
                $iframes.each(function (idx, el) {
                    $(el).load(function(idx){
                        var el = idx.target;
                        var src = el.src;
                        if (src.indexOf('embed-chart') !== -1 || src.indexOf('embed-dashboard') !== -1) {
                            $(el).contents().find('html').addClass('portaltype-fiche section-airs');
                            el.width = "100%";
                        }
                    });
                });
            }

        }());
    }

    // same requirement as above but for every fiche found within a collection pdf template
    var collection_air_fiches = $(".template-collection-pdf-body.section-airs");
    if (collection_air_fiches.length) {
        (function() {
            var $fiche_bodies = $(".fiche-body");
            $fiche_bodies.each(function(idx, el) {
                var $el = $(el);
                var $table = $el.find('table').eq(0);
                var $fiche_summary = $el.find(".fiche-summary");
                if ($table.length) {
                    $table.insertBefore($fiche_summary);
                }
            });
        }());
    }

    // #69065 move google chart button within externalActions
    var $charts_buttons = $(".google_buttons_bar").find('a');
    var $document_actions = $(".documentExportActions");
    var $document_actions_ul = $document_actions.find('ul');
    if ($document_actions_ul.length) {
        $charts_buttons.each(function(idx, el) {
            var $el = $(el);
            var $wrapped = $el.addClass('pull-left').wrap('<li />').parent();
            $wrapped.prependTo($document_actions_ul);
        });
    }

    $("[rel=__ac_name]").click(function(evt) {
        evt.preventDefault();
        var input = $(this).parent().find("[name='__ac_name']");
        input.focus();
    });

    $("[rel=__ac_password]").click(function(evt) {
        evt.preventDefault();
        var input = $(this).parent().find("[name='__ac_password']");
        input.focus();
    });

    $body.click(function() {
        $('#popup_login_form').slideUp();
    });

    /* #28278 prevent figures from printing charts without the figure title on the same line
     * data-and-maps/indicators/eea32-persistent-organic-pollutant-pop-emissions-1/assessment-4/pdf.body
     * data-and-maps/indicators/direct-losses-from-weather-disasters-2/assessment/pdf.body
     * */
    $(".policy_question").each(function(idx, el) {
        var $el = $(el);
        var $next_el = $el.next();
        if ($next_el.hasClass('indicator-figure-plus-container')) {
            $el.addClass("page-break-before");
            $next_el.find('.figure-title').addClass('no-page-break-before');
        }
    });

    /* 27537; insert a link for iframes that contain video since whkthmltopdf doesn't support
     * the video tag and there is no image placeholder */
    var $video_iframe = $("iframe").filter('[src*="video"]'), $video_iframe_src;
    if ($video_iframe) {
        $video_iframe_src = $video_iframe.attr('src');
        $("<a />", {
            'class': 'video_iframe_for_print visible-print',
            href: $video_iframe_src,
            html: "Video link: [" + $video_iframe_src + "]"
        }).insertBefore($video_iframe);
    }

    // 13830 add last-child class since ie < 9 doesn't know about this css3 selector
    $('.eea-tabs').find('li:last-child').addClass('last-child');

    // #9485; login form as popup
    $("#anon-personalbar, #siteaction-login").click(function(e) {
        $popup_login.slideToggle("slow", function() {
            $(this).find('[name="__ac_name"]').focus();
        });
        e.preventDefault();
        e.stopPropagation();
    });


    // #19536; hide navigation submenus if there are less than 2 of them
    var $navigation_submenus = $(".portletSubMenuHeader");
    if ($navigation_submenus && $navigation_submenus.length < 2) {
        $navigation_submenus.hide();
    }
    // #19536; adopt height of given data target; keep declaration after the
    // hiding of the navigation submenu from above
    $('.js-adoptHeight').each(function() {
        var $el = $(arguments[1]);
        var $target_el = $($el.data('target-element'));
        $el.css('height', $target_el.outerHeight());

    });
    // #17633 add eea-icon class to the plone message classes
    $(".attention, .caution, .danger, .error, .hint, .important, .note, .tip, .warning").addClass('eea-icon');


    // #5454 remove background for required fields that have the red square
    $(".required:contains('■')").addClass('no-bg');

    // removed portal-column-two from @@usergroup-userprefs #4817
    if ($("#portlet-prefs").length) {
        $("#portal-column-two").remove();
        $("#portal-column-content").removeClass('width-3:4').addClass('width-full');
    }
    // View in fullscreen for urls: /data-and-maps/figure and /data-and-maps/data
    var r = /data-and-maps\/(figures|data)\/?$/;
    if (r.test(url_path_name)) {
        $body.addClass('fullscreen');
        $('#icon-full_screen').parent().remove();
    }

    // #4157 move the non embedded links out of the enumeration of the embedded
    // links in order to preserve the design
    var $auto_related = $("#auto-related"),
        $prev = $auto_related.prev(),
        $dls = $auto_related.find('dl');
    if ($dls.length) {
        $auto_related.detach();
        $dls.each(function(idx, item) {
            var $item = $(item),
                $dt = $item.find('dt');
            $item.find('.portletItem').each(function(idx, item) {
                if (item.className.indexOf('embedded') === -1) {
                    $(item).insertAfter($dt);
                }
            });
        });
        $auto_related.insertAfter($prev);
    }

    function themePromotionPortlets(top_news) {
        var top_news_width = top_news.width();
        var margin = top_news_width * 0.012,
            w = Math.floor((top_news_width - 5 * margin) / 5);
        var promotions = top_news.find('.portlet-promotions');
        promotions.width(w);
        var last = promotions.last();
        promotions.not(last).css('marginRight', (Math.floor(margin) + 3) + 'px');
        last.css({'marginRight': '0px'});
    }

    // Layout of top promotions. It's safer to do this in JS as there was some rounding issues
    // with IE in window sizes that wasn't dividible by 5.
    var top_news = $('#top-news-area');
    if (top_news.length) {
        themePromotionPortlets(top_news);
    }

    /**
     * Function to avoid multiple clicks on document actions (Download as PDF, etc.)
     */
    jQuery.fn.avoidMultipleClicks = function(options) {
        var settings = {
            timeout: 3000,
            linkSelector: 'a',
            linkCSS: 'downloading',
            lockCSS: 'downloading-lock'
        };

        if (options) {
            jQuery.extend(settings, options);
        }

        var self = this;
        return this.each(function() {
            self.find(settings.linkSelector).click(function() {
                var context = $(this);
                var oldCSS = context.attr('class') || "";
                settings.linkCSS = oldCSS.split(' ').slice(0, 2).join(' ') + settings.linkCSS;
                context.removeClass();
                context.addClass(settings.linkCSS);

                self.addClass(settings.lockCSS);

                setTimeout(function() {
                    self.removeClass(settings.lockCSS);
                    context.removeClass(settings.linkCSS);
                    context.addClass(oldCSS);
                }, settings.timeout);

            });
        });
    };

    $('.documentActions .action-items').avoidMultipleClicks();
    $document_actions.avoidMultipleClicks({
        linkSelector: '.eea-icon',
        linkCSS: ' eea-icon-download eea-icon-anim-burst animated'
    });


    // #23277 track download of PDF and EPUBS #18753 as well as other downloads
    var file_types = ['pdf', 'gif', 'tif', 'png', 'zip', 'xls', 'eps', 'csv',
        'tsv', 'exhibit', 'txt', 'doc', 'docx', 'xlsx', 'table'];

    function check_file_type(tokens) {
        var tokens_length = tokens.length;
        var rought_ext = tokens[tokens_length - 1];
        var guess = rought_ext.split('/')[0];
        // return file extension in case we can't figure out the correct file type
        return file_types.indexOf(guess) === -1 ? 'file' : guess;
    }

    function extract_file_type(url, txt_contents) {
        var url_tokens = url.split('.');
        //data-and-maps/data/eea-coastline-for-analysis/gis-data/europe-coastline-shapefile/at_download/file
        // or synthesis/report/action-download-pdf/at_download/file have the file type as txt content of link
        // we might have a rought extension in case we have at_download links such as
        // landcoverflows_060701.pdf/at_download/file
        // check first the extension from the link text content and fallback to the url if we can't find
        // it in the text content otherwise return a generic file extension
        var txt_tokens = txt_contents.trim().toLowerCase().split('.');
        var txt_tokes_outcome = check_file_type(txt_tokens);
        if (txt_tokes_outcome === 'file') {
            return check_file_type(url_tokens);
        }
        return txt_tokes_outcome;
    }


    function capitalize(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function extract_portal_type() {
      var ptype = $('body').attr('class');
      if (ptype && ptype.match('portaltype-[a-z-]*')) {
        ptype = ptype.match('portaltype-[a-z-]*');
        ptype = ptype[0].split('-');
        ptype = ptype.length === 2 ? capitalize(ptype[1]) : capitalize(ptype[1]) + ' ' + capitalize(ptype[2]);
      }
      else {
        ptype = 'Unknown';
      }
      return ptype;
    }

    var links = document.getElementsByTagName('a');
    var portal_type = extract_portal_type();

    function match_download_links(links) {
        var list = [];
        var links_length = links.length;
        var link, link_href;
        for (var i = 0; i < links_length; i++) {
            try {
                link = links[i];
                link_href = link.href;
                // match only links that are comming from the eea site
                if (!link_href.match('eea.europa')) {
                    continue;
                }
                if (
                    link_href.match("/download[.a-zA-Z]*") ||
                    link_href.match("at_download") ||
                    link_href.match("/download$") ||
                    link_href.match("ftp.eea.europa")) {
                    list.push(link);
                }
            }
            catch(err) {
                window.console.log(err);
            }
        }
        return list;
    }

    var downloads_list = match_download_links(links);

    function add_downloads_tracking_code(idx, el) {
        el.onclick = function() {
            var text = el.textContent || el.innerText;
            var link = el.href || "download.pdf";
            var ftype = extract_file_type(link, text);
            if (window.ga) {
                ga('send', 'event', 'Downloads', link, ftype);
            }
            _paq.push(['trackEvent', 'Downloads', ftype, portal_type, 1]);
        };
        return el;
    }

    $.each(downloads_list, add_downloads_tracking_code);
    var download_pdf = document.getElementById("download");
    if(download_pdf) {
        add_downloads_tracking_code(0, download_pdf);
    }

    /* #26746 do now show the survey message for 1 year as we no longer need to show it */
    if (window.readCookie && !window.readCookie('survey_message')) {
        window.createCookie('survey_message', 'never', 365);
    }

    /* #27214 generic panel slider functionality */
    var $right_section_container = $(".eea-right-section");
    if ($right_section_container.length) {
        (function insert_section() {
            $right_section_container.each(function(idx, el) {
                // insert the slider button in case we are missing it if we want
                // to keep the needed markup as small as possible
                var $el = $(el), $right_section_slider = $el.prev();
                if (!$right_section_slider.hasClass('eea-right-section-slider')) {
                    $right_section_slider = $('<div class="eea-section eea-right-section-slider eea-scrolling-toggle-visibility"><span class="eea-icon eea-icon-5x eea-icon-caret-left eea-icon-anim-horizontal animated"></span></div>');
                    $right_section_slider.insertBefore($el);
                }
                $right_section_slider.click(function() {
                    var $this = $(this);
                    $this.toggleClass("eea-right-section-slider-active")
                        .next().toggleClass("eea-right-section-active eea-scrolling-keep-visible");

                    $this.removeClass("is-eea-hidden");

                    if ($this.hasClass("eea-right-section-slider-active")) {
                        // set overflow hidden when object is in view in order to
                        // avoid scrolling of body
                        document.body.style.overflow = 'hidden';
                        document.body.style.position = 'fixed';
                    }
                    else {
                        if (document.body.style.overflow === "hidden") {
                            document.body.style.overflow = 'auto';
                            document.body.style.position = 'relative';
                        }
                    }

                });

            });
        })();

    }
    if ($('#eea-above-columns').find('#portal-breadcrumbs').length) {
        $('#header-holder').find('.navbar').addClass('hideShadow');
    }

    // 91577 show and hide mobile menu
    $(".navbar-toggle").click(function(ev) {
        $(ev.target).toggleClass('collapsed');
        $(".navbar-collapse").toggleClass('in');
    });

    $('#globalstatusmessage').each(function(idx, el) {
        $(el).find("dl:not([class*='eea-icon'])").addClass("eea-icon eea-icon-magic");
        $(el).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200).fadeOut(200).fadeIn(200);
    });

    var scroll_analytics_enabled = $body.hasClass("scroll-analytics");

    // track print attempt with google analytics
    // original code from https://www.savio.no/analytics/how-to-track-printed-pages-in-google-analytics
    if (is_anon) {
        (function() {
            var runOnce;
            var afterPrint = function() {
                if (!runOnce) { // Because of Chrome we can only allow the code to run once.
                    runOnce = true;
                    if (window.ga) {
                        window.ga('send', 'event', 'Print Action', window.location.host, window.location.href);
                    }
                    _paq.push(['trackEvent', 'Reading', 'print', portal_type, 1]);
                }
            };
            window.onafterprint = afterPrint; // Internet Explorer
            $(document).keydown(function(allBrowsers) { // Track printing using Ctrl/Cmd+P.
                if (allBrowsers.keyCode === 80 && (allBrowsers.ctrlKey || allBrowsers.metaKey)) {
                    afterPrint();
                }
            });
            if (window.matchMedia) { // Track printing from browsers using the Webkit engine
                var mediaQueryList = window.matchMedia('print');
                mediaQueryList.addListener(function(mql) {
                    if (mql.matches) {
                        afterPrint();
                    }
                });
            }

        }());
    }
    if (scroll_analytics_enabled) {
        $content_core.screentimeAnalytics();
    }
});

