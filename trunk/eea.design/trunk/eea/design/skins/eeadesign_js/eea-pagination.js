jQuery(document).ready(function($) {
    var $related_items = $("#relatedItems"),
        has_related_items = $related_items.length,
        $eea_tabs = $("#eea-tabs"),
        $eea_tabs_panels = $("#eea-tabs-panels"),
        pagination_count = 12;

    if ( has_related_items ) {
        if ( !$eea_tabs.length ) {
            $eea_tabs = $("<ul id='eea-tabs' class='two-rows' ></ul>").insertBefore($related_items);
            $eea_tabs_panels = $("<div id='eea-tabs-panels' ></div>").insertAfter($eea_tabs);
        }
    }

    $related_items.find('.visualNoMarker').each(function() {
        var $self = $(this),
            $children = $self.children(),
            count = 0, id;

        $children.each(function () {
            var items;
            var orig_entries;
            var num_entries;
            var childes;
            var $this = $(this);
            if ( this.tagName === "H3" ) {
                $('<li />').html($this.detach().html()).appendTo($eea_tabs);
            }
            else {
                count += 1;
                id = "panel" + count;
                $this.data($self.data());
                childes = $this.children();
                num_entries = childes.length;
                orig_entries = num_entries;

                $this.empty();
                count = 0;
                while ( num_entries > 0 ) {
                    count += 1;
                    items = childes.splice(0, num_entries > pagination_count ? pagination_count : num_entries);
                    $('<div />', { class: "page",
                                   'data-count': num_entries > pagination_count ? pagination_count : num_entries })
                                 .append(items).append('<div class="visualClear" />').appendTo($this);
                    num_entries = childes.length;
                }

                $this.addClass('eea-tabs-panel')
                    .appendTo($eea_tabs_panels)
                    .attr('id', id);

                $("<div class='paginator listingBar' />").prependTo($this).pagination(orig_entries, {
                    items_per_page: pagination_count,
                    next_text: $("#eeaPaginationNext").text(),
                    prev_text: $("#eeaPaginationPrev").text(),
                    item_text: $("#eeaPaginationItems").text(),
                    callback: function (idx, el) {
                        var $parent = el.parent(),
                            $page = $parent.find('.page').hide().eq(idx),
                            page_count = $page.next().data('count'),
                            next_item = $parent.find('.next')[0];
                        if ( next_item ) {
                            next_item.innerHTML = next_item.innerHTML.replace(pagination_count, page_count);
                        }
                            $page.show();
                        return false;
                    }
                });
            }
        });
    });

    var figure_batch = function() {
        $eea_tabs_panels.delegate('.listingBar', "click", function(e){
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
                    href = link            +
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
