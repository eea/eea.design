jQuery(document).ready(function($) {
    // check if related_items isn't an select tag which is found in the edit
    // widget
    var $related_items = $("#relatedItems"),
        has_related_items = $related_items.length &&
                                         $related_items[0].tagName !== 'SELECT',
        $eea_tabs = $("#eea-tabs"),
        $paginate = $(".paginate"),
        $eea_tabs_panels = $("#eea-tabs-panels"),
        pagination_count = 12;

    $.merge($paginate, $related_items.find('.visualNoMarker')).each(function() {
        var $self = $(this),
            $children = $self.children(),
            count = 0,
            isPaginate = $self.hasClass('paginate');
        pagination_count =  window.parseInt(
                    $self.attr('data-paginate-count'), 10) || pagination_count;
        // if first element is an h3 then we should get the children since we
        // will introduce tabs and content will follow as:
        // h3  followed by a div full of children which will be paginated
        $children = isPaginate && $children[0].tagName !== "H3" ?
                                                               $self : $children;
        $children.each(function () {

            var items;
            var orig_entries;
            var num_entries;
            var childes;
            var $this = $(this);
            if ( this.tagName === "H3" ) {
                // insert eea-tabs divs if we have h3 elements and we don't
                // already have eea_tabs div inserted like in the case of paginate divs
                $eea_tabs = !$eea_tabs.length ? $("<ul class='eea-tabs two-rows' />")
                    .insertBefore($self) : $eea_tabs;
                $eea_tabs_panels = !$eea_tabs_panels.length ? $("<div class='eea-tabs-panels' />")
                    .insertAfter($eea_tabs) : $eea_tabs_panels;
                $('<li />').html($this.detach().html()).appendTo($eea_tabs);
            }
            else {
                $this.data($self.data());
                childes = $this.children();
                num_entries = childes.length;
                orig_entries = num_entries;

                $this.empty();
                while ( num_entries > 0 ) {
                    count += 1;
                    items = childes.splice(0, num_entries > pagination_count ?
                                                pagination_count : num_entries);
                    $('<div />', { 'class': "page",
                                   'data-count': num_entries > pagination_count ?
                                                pagination_count : num_entries })
                                 .append(items)
                                 .append('<div class="visualClear" />')
                                 .appendTo($this);
                    num_entries = childes.length;
                }

                $this.addClass('eea-tabs-panel').appendTo($eea_tabs_panels);

                $("<div class='paginator listingBar' />").prependTo($this)
                                                         .pagination( orig_entries,
                {
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
                            next_item.innerHTML = next_item.innerHTML
                                        .replace(pagination_count, page_count);
                        }

                        $page.show();
                        return false;
                    }
                });
            }
        });
        // reset tabs after each paginate class since we could have more than
        // one element that is paginated per page
        if ( isPaginate ) {
            $eea_tabs = "";
            $eea_tabs_panels = "";
        }

    });

    if ( has_related_items || $paginate.length ) {
        window.EEA.eea_tabs();
    }

});
