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
        $other_children.each(function(i,v) {
            if (first_child_offset < v.offsetTop) {
                longer_elems.push(i);
            }
        });
        
        var i = 0, longer_elems_length =  longer_elems.length, selected_item;
        var $latest_visible = longer_elems_length ? $other_children.eq([longer_elems[0] - 1]) : $other_children.eq($other_children.length - 1);
        if (subfolders_listing.width() - ($latest_visible.position().left + $latest_visible.width()) < 100) {
            $latest_visible.detach().appendTo(holder_ul); 
        }  
        if (longer_elems_length) {
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
        holder.hover(function() {
            holder_link.addClass('moreHover');
        }, function() {
            holder_link.removeClass('moreHover');
        });
    };
    if (subfolders_listing.length) {
        subfolders_init();
    }
});
