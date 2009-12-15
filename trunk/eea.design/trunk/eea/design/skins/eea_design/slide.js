$(document).ready(function() {
    // Custom effect to quickly show the panel on mouseover, but slowly
    // fade away on mouseout. This provides quick navigation and makes it easier
    // to see where the panel is going.
    $.tools.tooltip.addEffect("sharpInFadeOut", 
        function(done) { 
            this.getTip().show();
            done.call(); 
        }, 
        function(done) { 
            this.getTip().fadeOut('fast');
        } 
    );

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
                events: {
                    tooltip: 'mouseover' 
                },
                effect: 'sharpInFadeOut',
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
});
