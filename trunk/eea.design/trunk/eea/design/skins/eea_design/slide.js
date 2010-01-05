$(document).ready(function() {
    function panel(i) {
        var a = $(this);
        var tooltip = $('#tip-' + a.parent().attr('id'));
        if (tooltip.length > 0) {
            a.attr("title","").attr("href", "#");

            a.mouseover(function() {
                a.parent().addClass("selected");
            });

            // the tooltip panel should have the id in form of
            // tip-SITEACTION-ID
            a.tooltip({
                tip: tooltip[0],
                position: 'bottom center',
                offset: [0, 0],
                delay: 1000,
                effect: 'fade',
                events: {
                    tooltip: 'mouseover' 
                },
                onShow: function(e) {
                    a.parent().addClass("selected");
                },
                onBeforeHide: function(e, i) {
                    a.parent().removeClass("selected");
                }
            });
        }

        // remove panel if user clicks outside it
        $(document).click(function(e) {
            var target = $(e.target);
            if (!target.is('.panel') && !target.parents('.panel').length) {
                $('.panel').fadeOut('fast');
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
