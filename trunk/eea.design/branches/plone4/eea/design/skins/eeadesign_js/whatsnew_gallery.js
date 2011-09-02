(function($) {
    $(function() {

        $("#highlights-high, #highlights-middle").tabs("div.highlightMiddle", {tabs: 'div.panel', effect: 'slide'});

        var host = window.location.host, http = 'http://',
            localhost = host.indexOf('localhost') != '-1' ? true : undefined,
            site_address = localhost ? http + host + '/www/' : http + host + '/';

        var whatsnew_func = function(cur_tab_val, sel_text, sel_value, index) {
                var address = site_address + cur_tab_val + "_gallery_macro";
                var gal = $("#whatsnew-gallery").find(".highlights");
                var news = index ? gal[index] : $("#whatsnew-gallery").find(".highlights:visible"); 

                // workaround: we need the first highlights because when we click on the
                // first tab gal[0] returns the second highlights instead of
                // the first so we redefine news to the first found match if
                // index is 0
                var first = gal.first();
                var news = index === 0 ? first : news;

                var filter_topic = index ? news.firstElementChild : news[0].firstElementChild,
                    filter_topic_text = "Filtered by <span>" + sel_text + "</span> topic";
                    filter_topic.innerHTML = sel_value ? filter_topic_text : "";

                var no_results = $("<div class='portalMessage informationMessage'><p>No results are available for this topic</p></div>");
                var gallery_ajax = $(".gallery-ajax", news);
                var layout_selection = $('.gallery-layout-selection li a', news)[0];
                
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
        };

        $("ul#tabs").tabs("> .highlights", function(event, index) {
            var cur_tab = this.getTabs()[index];
                cur_tab.data = cur_tab.data || "none",
                cur_tab_val = cur_tab.id.substr(4);
            var opt_item = $("#topic-selector").find(":selected");
                sel_value = opt_item.val(),
                sel_text = opt_item.text();

            if (sel_text === "All topics") {
                whatsnew_func(cur_tab_val = cur_tab_val, sel_text = sel_text, sel_value = sel_value, index = index);
            }
            if (sel_value) {
                if (cur_tab.data !== sel_value) {
                    cur_tab.data = sel_value;
                    whatsnew_func(cur_tab_val = cur_tab_val, sel_text = sel_text, sel_value = sel_value, index = index);
                }
            }
        });


        $topic_selector = $("#topic-selector");
        $topic_selector.find('[value="default"]').remove();
        $topic_selector.change(
            function displayResult() {
                // hide filter by topic after we choose a topic to filter the
                // results
                $topic_selector[0][0].className = "hidden";

                var x = this.selectedIndex,
                    y = this.options;
                var topic_value = y[x].value,
                    topic_text = y[x].innerHTML;
                var tab_val = $("#tabs a.current")[0].id.substr(4);
               
                whatsnew_func(cur_tab_val = tab_val, sel_text = topic_text, sel_value = topic_value);
            }
        );

        // selection of folder_summary_view or atct_album_view
        var layout_links = $(".gallery-layout-selection li a");
        layout_links.click( function(e) {
             var $this = $(this);
             var $parent = $this.parent();
             var $ajax = $this.closest('ul').next();
             var $hidden_gallery = $ajax.find(".hiddenStructure");
             var listing = $ajax.find('.gallery-listing');
             var album = $ajax.find('.gallery-album');
             var next = $parent.siblings().find('a');
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

