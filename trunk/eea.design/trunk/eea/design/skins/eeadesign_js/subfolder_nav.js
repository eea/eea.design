jQuery(function($) {
    "use strict";
    var subfolders_listing = $("#subfolders_listing"),
        next_elem = subfolders_listing.next(),
        holder = $("<li><a href='#' id='subfolders_more'>More</li>");
        var holder_ul = $("<ul />").appendTo(holder);
    var subfolders = function() {
        var children = subfolders_listing.children();
        var first_child = children[0],
            first_child_offset = first_child.offsetTop,
            $other_children = $(children.slice(1));
        var longer_elems = [];
        $other_children.each(function(i,v) {
            if (first_child_offset < v.offsetTop) {
                longer_elems.push(i);
            }
        });
        var $latest_visible = $other_children.eq([longer_elems[0] - 1]);
        if (subfolders_listing.width() - ($latest_visible.position().left + $latest_visible.width()) < 100) {
            $latest_visible.detach().appendTo(holder_ul); 
        }  
        subfolders_listing.detach();
        var i = 0, longer_elems_length =  longer_elems.length;
        for(i; i < longer_elems_length; i+=  1) { 
            $other_children.eq(longer_elems[i]).detach().appendTo(holder_ul);
        }
        holder.appendTo(subfolders_listing);
        subfolders_listing.removeClass('overflow_hidden');
        subfolders_listing.insertBefore(next_elem);
    };
    if (subfolders_listing.length) {
        subfolders();
    }
});
