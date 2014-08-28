/* global jQuery window */
jQuery(document).ready(function($) {
    'use strict';
    var url_path_name = window.location.pathname;
    var ie;
    if ($.browser) {
      ie = $.browser.msie && parseInt($.browser.version, 10);
    } else {
      var nav = navigator.userAgent;
      ie = nav.indexOf('MSIE');
      ie < 0 ? ie = false : ie = parseInt(nav.substring(ie+5, ie+7));
    }

    // #16878 move last two links of globalnav to a secundary container
    var secundary_portaltabs = $("<ul id='secundary-portaltabs'></ul>"),
        global_nav = $('#portal-globalnav'),
        global_nav_children = global_nav.children(),
        last_two_nav_items = global_nav_children.slice(global_nav_children.length - 2);
    last_two_nav_items.appendTo(secundary_portaltabs);
    secundary_portaltabs.appendTo(global_nav);

    // 13830 add last-child class since ie < 9 doesn't know about this css3 selector
    $('.eea-tabs').find('li:last-child').addClass('last-child');

    // #9485; login form as popup
    var $popup_login = $("#popup_login_form");
    $("#anon-personalbar, #siteaction-login").click(function(e) {
        $popup_login.slideToggle();
        e.preventDefault();
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

    // #20389 - time counter to remind editors save their work
    // Delay can be overriten like this (value in miliseconds): $.timeoutDialog({delay: 900000});
    try {
        $.timeoutDialog({delay: 900000}); // set to be triggered after 15 minutes
    }
    catch(err) {
        // console.log(err);
    }

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
        $('body').addClass('fullscreen');
        $('#icon-full_screen').parent().remove();
    }

    // 5267 display form fields for translated items
    var edit_bar = $("#edit-bar");
    var edit_translate = function() {
        var translating = $("#content").find('form').find('.hiddenStructure').text().indexOf('Translating');
        if (translating !== -1) {
            edit_bar.closest('#portal-column-content')[0].className = "cell width-full position-0";
        }
    };
    if (edit_bar) {
        edit_translate();
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

    /**
     * Function to animate ecotip bulb
     */
    var toggleEcotipClass = function() {
        var ecotip = $('#portlet-ecotip'),
            action, bulb, led;
        if (ie && ie < 10) {
            bulb = ecotip.find('.ecotip-bulb');
            led = ecotip.find('.led-bulb');
            action = function() {
                if ($.fadeToggle) {
                    bulb.fadeToggle();
                    led.fadeToggle();
                }
                else {
                    bulb.is(":visible") ? bulb.fadeOut() : bulb.fadeIn();
                    led.is(":visible") ? led.fadeOut() : led.fadeIn();
                }
            };
        }
        else {
            action = function() {
                ecotip.toggleClass('hover');
            };
        }

        toggleEcotipClass = function() {
            return action();
        };
        return toggleEcotipClass();
    };
    toggleEcotipClass();
    window.setInterval(toggleEcotipClass, 5000);

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
    jQuery.fn.avoidMultipleClicks = function(options){
      var settings = {
        timeout: 3000
      };

      if(options){
        jQuery.extend(settings, options);
      }

      var self = this;
      return this.each(function(){
        self.find('a').click(function(){
          var context = $(this);
          context.addClass('downloading');
          self.addClass('downloading-lock');

          setTimeout(function(){
            self.removeClass('downloading-lock');
            context.removeClass('downloading');
          }, settings.timeout);

        });
      });
    };

    $('.documentActions .action-items').avoidMultipleClicks();

});
