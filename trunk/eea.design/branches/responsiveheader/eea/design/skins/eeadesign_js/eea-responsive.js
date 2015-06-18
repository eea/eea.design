/* global jQuery window */
jQuery(document).ready(function($) {
    var $holder = $("<div class='eea-accordion-panels collapsed-by-default non-exclusive' />");
    var $cross_site_top = $("#cross-site-top");
    $holder.prependTo($cross_site_top);
    $("#portal-externalsites, #portal-siteactions").each(function accordions(idx, el){
        var $el = $(el);
        var lists = $el.find('li');
        lists.each(function(idx, el){
            var $acordion_panel = $("<div class='eea-accordion-panel' />");
            var $el = $(el);
            var $old_panel = $("#tip-" + el.id);
            var $panel = $("<div />", {
                class: 'pane',
                html: $old_panel.find('.panel-content').html()});
            var $result = $("<h2 />", {
                class: 'eea-icon-right-container',
                html: $el.find('a').text()});
            $old_panel.remove();
            $result.appendTo($acordion_panel);
            $panel.appendTo($acordion_panel)
            $acordion_panel.appendTo($holder);
        });
        $el.remove();
    });
    //$cross_site_top.insertAfter("#portal-personaltools-wrapper");
});

