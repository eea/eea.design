(function($) {
    $(document).ready(function() {

        // Disable cross-site-panels for IE6.
        // TODO: remove this snippet when we completely drop suuport for IE6.
        if ($.browser.msie && parseInt($.browser.version) < 7) {
            return;
        }

        function panel(i) {
            var a = $(this);
            var tooltip = $('#tip-' + a.parent().attr('id'));
            if (tooltip.length > 0) {
                a.attr("title","").attr("href", "#");

                // the tooltip panel should have the id in form of
                // tip-SITEACTION-ID
                a.tooltip({
                    tip: tooltip[0],
                    position: 'bottom center',
                    offset: [0, 0],
                    delay: 1000,
                    events: {
                        def: 'click, blur'
                    }
                });
            }

            // remove panel if user clicks outside it
            $(document).click(function(e) {
                var target = $(e.target);
                if (!target.is('#cross-site-top .panel') && !target.parents('#cross-site-top .panel, #cross-site-top').length) {
                    $('#cross-site-top .panel').fadeOut('fast');
                }
            });
        }
        $("#portal-siteactions a").each(panel);
        $("#portal-externalsites a").each(panel);

        // since we use the standard events_portlet, we can't place the
        // submit-event-link in its footer initially
        var footer = $("#tip-siteaction-events .portletFooter");
        var submitLink = $("#tip-siteaction-events #submit-event-link");
        submitLink.remove().css('margin-right', '0.5em');
        footer.prepend(submitLink);
    });
})(jQuery);
