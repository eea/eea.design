(function($) {

    // These regexps are stolen from match_special_links.js
    // http://domain/LL/....
    var langregex1 = new RegExp("(http://[a-z0-9.:]*)/(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)/.*");
    // http://domain/LL
    var langregex2 = new RegExp("(http://[a-z0-9.:]*/)(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)$");
    function isCurrentPageTranslated() {
        var link = document.location.href.toLowerCase();
        return langregex1.test(link) || langregex2.test(link);
    }

    $(document).ready(function() {
        // Disable cross-site-panels for IE6.
        // TODO: remove this snippet when we completely drop suuport for IE6.
        if ($.browser.msie && parseInt($.browser.version, 10) < 7) {
            return;
        }

        function panel(i) {
            var a = $(this);
            var buttonID = a.parent().attr('id');
            var tooltip = $('#tip-' + buttonID);

            // 'Contact us' link should go to old translated page because the
            // pop up is hardcoded in english. #2954
            if (buttonID == "siteaction-contactus" && isCurrentPageTranslated()) {
                return;
            }
            var offset = buttonID === "article-language" ? [-170, -513] : [0, 0];
            if (tooltip.length > 0) {
                a.attr("title","").attr("href", "#");

                fordef = 'click, blur';
                a.tooltip({
                    tip: tooltip[0],
                    position: 'bottom right',
                    offset: offset,
                    delay: 10000000,
                    events: {
                        def: fordef
                    }
                });

                a.click(function(ev) {
                    ev.preventDefault(); 
                    tooltip.fadeIn('fast');
                });
                tooltip.bind('mouseleave', function() {
                    tooltip.fadeOut('fast');
                });
            }

        }
        $("#portal-siteactions a").each(panel);
        $("#portal-externalsites a").each(panel);
        $("#article-language").find('a').each(panel);
        $("#tip-externalsites-networks").find(".externalsites a").each(panel);
        // since we use the standard events_portlet, we can't place the
        // submit-event-link in its footer initially
        var footer = $("#tip-siteaction-events .portletFooter");
        var submitLink = $("#tip-siteaction-events #submit-event-link");
        submitLink.remove().css('margin-right', '0.5em');
        footer.prepend(submitLink);
    });
})(jQuery);
