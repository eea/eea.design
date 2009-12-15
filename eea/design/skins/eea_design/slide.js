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
