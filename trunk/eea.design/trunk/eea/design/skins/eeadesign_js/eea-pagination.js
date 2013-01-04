jQuery(document).ready(function($) {
    var $related_items = $("#relatedItems"),
        has_related_items = $related_items.length,
        $eea_tabs = $("#eea-tabs"),
        $eea_tabs_panels = $("#eea-tabs-panels");

if ( has_related_items ) {
        if ( !$eea_tabs.length ) {
            $eea_tabs = $("<ul id='eea-tabs' class='two-rows' />").insertBefore($related_items);
            $eea_tabs_panels = $("<div id='eea-tabs-panels' />").insertAfter($eea_tabs);
        }
    }

    $related_items.find('.visualNoMarker').each(function() {
        var $self = $(this);
        var $children = $self.children();
        var count = 0, id;
        $children.each(function () {
            var $this = $(this);
            if ( this.tagName === "H3" ) {
                $('<li />').html($this.detach().html()).appendTo($eea_tabs);
            }
            else {
                count += 1;
                id = "panel" + count;
                $this.data($self.data());
                var childs = $this.children();
                var num_entries = childs.length;
                var orig_entries = num_entries;
                var items;
//                var wrapped = [];
                $this.empty();
                count = 0;
                while ( num_entries > 0 ) {
                    count += 1;
                    items = childs.splice( 0, num_entries > 8 ? 8 : num_entries );
                    $('<div class="page" />').append(items).appendTo($this);
                    num_entries = childs.length;
                }

                $this.addClass('eea-tabs-panel')
                     .appendTo($eea_tabs_panels)
                     .attr('id', id);

                $("<div class='paginator' />").prependTo($this).pagination(orig_entries, {
                    items_per_page: 8,
                    callback: function (e, el) {
                        el.parent().find('.page').hide().eq(e).show();
                        return false;
                    }
                });
            }
        });
    });
    
    var figure_batch = function() {
        var $tab_panels = $eea_tabs_panels;
        $tab_panels.delegate('.listingBar', "click", function(e){
            var item = e.target, queries_index, queries, href, link, data_attr;
            var $panel = $(this).closest('.eea-tabs-panel');
            if ( item.tagName === "A" ) {
                $panel.html('<img src="++resource++faceted_images/ajax-loader.gif" />');
                data_attr = $panel.data();
                href = item.href;
                if ( href.indexOf('b=true') === -1 ) {
                    queries_index = href.indexOf('?');
                    queries = href.slice(queries_index);
                    link = href.slice(0, queries_index);
                    href = link               +
                           data_attr.template +
                           queries            +
                           '&'                +
                           $.param({ m: data_attr.relation, b: true, c: data_attr.count });
                }
                $.get(href, function ( data ) {
                    $panel.html($(data).children().eq(1).remove());
                });
            }
            e.preventDefault();
        });
    };

    if ( has_related_items ) {
        $eea_tabs_panels.addClass('eea-tabs-panels');
        $eea_tabs.addClass('eea-tabs');
        window.EEA.eea_tabs();
        figure_batch();
    }
});
