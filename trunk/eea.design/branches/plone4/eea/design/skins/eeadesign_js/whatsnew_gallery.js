(function($) {
    $(function() { 
        $("#highlights-high, #highlights-middle").tabs("div.highlightMiddle", {tabs: 'div.panel', effect: 'slide'});
        $("ul#tabs").tabs("> .highlights");

        var site_address = window.location.href;
        // remove any # or #items links from the site link address 
        site_address = site_address.replace(/#\w*/, '');
        
        var datamaps = $("#datamaps-highlights");
        var data_address  = site_address + "data-and-maps" + " " + ".photoAlbumEntry";
        datamaps.load(data_address);

        $topic_selector = $("#topic-selector");
        $topic_selector.find('[value="default"]').remove();
        $topic_selector.change(
            function displayResult() {
                var x = this.selectedIndex,
                    y = this.options;
                var sel_value = y[x].value;
                var cur_tab_val = $("#tabs a.current").text().toLowerCase();
                var news = $(".highlights").filter( function(index) { 
                     return this.style.display === "block"; 
                });
                var address = site_address + cur_tab_val + "_gallery_macro";
                var no_results = $("<div class='portalMessage informationMessage'><p>No results are available for this topic</p></div>");
                var gallery_ajax = $(".gallery-ajax", news);
                var layout_selection = $('.gallery-layout-selection a', news)[0];
                gallery_ajax.load( address, {topic: sel_value, tab: cur_tab_val },  function(html) {
                    if (html.length > 1) {
                        if (layout_selection.className === "list-layout active-list"){
                            gallery_ajax.find('.gallery-album').addClass('hiddenStructure'); 
                        }
                        else {
                            gallery_ajax.find('.gallery-listing').addClass('hiddenStructure'); 
                        
                        }
                        if (cur_tab_val === "multimedia") {
                            $.getScript(site_address + "eea-mediacentre.js");
                        }
                    }
                    else {
                       no_results.appendTo(gallery_ajax);
                    }
                    
                });
            }
        );

        // selection of folder_summary_view or atct_album_view
        var layout_links = $(".gallery-layout-selection a");
        layout_links.filter( function() { return this.className === '';}).remove();        
        var filtered_links = layout_links.filter( function() { return this.className != '';}); 
        var listing_layout = $(".gallery-listing");
        filtered_links.click( function(e) {
             var $this = $(this);
             var $parent = $this.parent();
             var $ajax = $parent.next();
             var $hidden_gallery = $ajax.find(".hiddenStructure");
             var listing = $ajax.find('.gallery-listing');
             var album = $ajax.find('.gallery-album');
             var next = $this.siblings().first();
             var link_class = $this[0].className;
             
             if ( link_class === "list-layout active-list" || link_class === "album-layout active-album") {
                 return false;
             };

            if (link_class == "list-layout") {
                album.slideUp();
                listing.slideDown();
                $hidden_gallery.removeClass("hiddenStructure");
                $this.toggleClass("active-list");
                next.toggleClass("active-album");
                return false;
            }
            else {
                listing.slideUp();
                album.slideDown();
                $hidden_gallery.removeClass("hiddenStructure");
                $this.toggleClass("active-album");
                next.toggleClass("active-list");
                return false;
            }
        });
    });

})(jQuery);
