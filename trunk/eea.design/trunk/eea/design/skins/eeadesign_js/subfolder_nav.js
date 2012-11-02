jQuery(function($) {
    "use strict";
    var subfolders_listing = $("#subfolders_listing"),
        next_elem = subfolders_listing.next();
    var subfolders_init = function() {
        var holder = $('#subfolders_more_li'),
            holder_ul = holder.find('#subfolders_more_ul'),
            holder_link = holder.find('#subfolders_more_a'),
            children = subfolders_listing.children(),
            first_child = children[0],
            first_child_offset = first_child.offsetTop,
            $other_children = $(children.slice(1)),
            longer_elems = [];

        if (!$other_children.length) {
            return;
        }
        $other_children.each(function(i,v) {
            if (first_child_offset < v.offsetTop) {
                longer_elems.push(i);
            }
        });

        var i = 0, longer_elems_length =  longer_elems.length, selected_item;
        var $latest_visible = longer_elems_length ? $other_children.eq([longer_elems[0] - 1]) : $other_children.eq($other_children.length - 1),
            subfolders_listing_width = subfolders_listing.width(),
            $prev_el = $latest_visible.prev(), 
            temp;

        if (longer_elems_length &&  subfolders_listing_width - ($latest_visible.position().left + $latest_visible.width()) < 150) {
            // append last visible item if there isn't enought space for menu list 
            $latest_visible.appendTo(holder_ul); 
        }
        if (longer_elems_length) {
            // append even visible items if there isn't enought space for menu popup
            while(subfolders_listing_width - ($prev_el.position().left + $prev_el.width()) < 150) {
                temp = $prev_el.prev();
                $prev_el.appendTo(holder_ul); 
                $prev_el = temp;
            } 
        }
        if (longer_elems_length) {
            // add longer items to the more submenu
            subfolders_listing.detach();
            holder.removeClass('hiddenElem').appendTo(subfolders_listing);
            for(i; i < longer_elems_length; i+=  1) { 
                selected_item = $other_children.eq(longer_elems[i]);
                if (selected_item.attr('id') !== 'subfolders_more_li') {
                    selected_item.detach().appendTo(holder_ul);
                }
            }
            subfolders_listing.removeClass('overflow_hidden');
            subfolders_listing.insertBefore(next_elem);
        }
        holder.click(function(e) {
            e.preventDefault();
        });
        holder.hover(function() {
            holder_link.addClass('moreHover');
        }, function() {
            holder_link.removeClass('moreHover');
        });
    };

    var mark_selected_navigation = function() {
        var portal_breadcrumbs = $("#portal-breadcrumbs"),
            breadcrumbs = portal_breadcrumbs.find('span:not(.breadcrumbSeparator)'),
            portal_globalnav = $("#portal-globalnav"),
            i = 0, breadcrumbs_length = breadcrumbs.length,
            title, current;
        for (i; i < breadcrumbs_length; i+= 1) {
            current = breadcrumbs[i];
            title = current.getElementsByTagName('a');
            title = title.length ? title[0].innerHTML : current.innerHTML;
            var nav_item = portal_globalnav.find("a:contains('" + title + "')");
            if (nav_item.length) {
                nav_item.parent().append('<span class="arrowUp" />');
                break;
            }
        }
    };

    if (subfolders_listing.length) {
        subfolders_init();
        mark_selected_navigation();
    }
});
