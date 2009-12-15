$(document).ready(function() {
    function panel(i) {
        var a = $(this);
        var tooltip = $('#tip-' + a.parent().attr('id'));
        if (tooltip.length > 0) {
            a.attr("title","").attr("href", "#");

            a.mouseover(function() {
                a.parent().addClass("selected");
            });

            var offsets = {
                'tip-siteaction-eionet': [0, 0],
                'tip-siteaction-envirowindows': [0, 0],
                'tip-siteaction-etcssites': [0, 0],
                'tip-siteaction-subscriptions': [0, 0],
                'tip-siteaction-contactus': [0, 0],
                'tip-siteaction-chooselang': [0, 0]
            }

            console.log(tooltip.width());

            console.log(tooltip.attr('id') + ' -> ' + offsets[tooltip.attr('id')]);

            // the tooltip panel should have the id in form of
            // tip-SITEACTION-ID
            a.tooltip({
                tip: tooltip[0],
                position: 'bottom center',
                offset: offsets[tooltip.attr('id')],
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
    }
    $("#portal-siteactions a").each(panel);
    $("#portal-externalsites a").each(panel);
});
