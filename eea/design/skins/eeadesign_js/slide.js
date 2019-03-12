/* EXTERNAL DEPENDENCIES: eea.tabs.js */

/* client side pagination
 * eg: https://www.eea.europa.eu/code/design-elements#toc-66
 * used in relatedItems tabs
 * https://www.eea.europa.eu/publications/eu-2010-biodiversity-baseline
 */
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
        function panel() {
            var $el = $(this);
            var buttonID = $el.attr('id');
            if (!buttonID) {
                return;
            }
            var $tooltip = $('#tip-' + buttonID);

            var article_lang = buttonID === "article-language";

            var fordef;
            if ($tooltip.length > 0) {
                // if we don't remove title from links the title will be used for tooltip
                // content instead of the constructed panels
                // var initial_title =  a.attr("title");
                // a.attr("title", "").removeAttr("href");
                fordef = 'click, blur';
                $el.tooltip({
                    tip: $tooltip[0],
                    position:'bottom center',
                    offset: [0, 0],
                    delay: 10000000,
                    events: {
                        def: fordef
                    }
                });
                // re add original title which can be set after the tooltip logic
                // a.attr('title', initial_title);
                $el.click(function(ev) {
                    
                    ev.preventDefault();
                    var $this = $(this), tooltip = $tooltip[0];
                    var $panels = $('.panel');
                    $panels.each(function() {
                        var $this = $(this);
                        var $id = $this.attr('id');
                        if ($id !== "" && $id !== $tooltip.attr('id')) {
                            $this.fadeOut('fast');
                        }
                    });

                    if (article_lang) {
                        $("#tip-article-language").css({
                            position: 'absolute',
                            top: '48px',
                            display: 'block',
                            right: '0px',
                            left: ''
                        });
                    }

                    // attempt to position the tooltip bottom right from target on mini_header
                        var gnav_pos_left = window.Math.floor($("#secondary-portaltabs").offset().left);
                        var pos_left = window.Math.floor($this.offset().left);
                        var eWidth = $this.outerWidth();
                        var tWidth = $tooltip.outerWidth();
                        var left = pos_left + eWidth - gnav_pos_left - tWidth + "px";
                        if (tooltip.style.left !== left) {
                            tooltip.style.left = left;
                        }
                    $tooltip.fadeIn('fast');
                });
            }
        }

        $("#portal-columns, #portal-header").click(function(e) {
            var target = $(e.target);
            target = target[0].tagName === "A" ? target : target.parent();
            var parents = $('.navbar-header, #content'),
                panels = parents.find('.panel');

            if (!target.is('#portal-globalnav > a, #secondary-portaltabs a, #cross-site-top .panel, #article-language a') && !target.parents('.panel').length) {
                panels.fadeOut('fast');
                $(".eea-navsiteactions-active").removeClass("eea-navsiteactions-active");
            }
        });

        $("#secondary-portaltabs").addClass('eea-slide-tooltips');
        $("#article-language").each(panel);
        $(".eea-slide-tooltips").find('> li').each(panel);
    });
}(jQuery));
