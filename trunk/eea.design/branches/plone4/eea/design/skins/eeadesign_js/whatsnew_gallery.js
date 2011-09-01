(function($) {
    $(function() {
        $("#highlights-high, #highlights-middle").tabs("div.highlightMiddle", {tabs: 'div.panel', effect: 'slide'});
        var whatsnew_func = function(cur_tab_val, sel_text, sel_value) {
                var news = $("#whatsnew-gallery").find(".highlights:visible"); 
                var address = site_address + cur_tab_val + "_gallery_macro";

                // filter by topic notice
                var filter_topic = news.find(".filter-topic")[0],
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
        var host = window.location.host, http = 'http://',
            localhost = host.indexOf('localhost') != '-1' ? true : undefined,
            site_address = localhost ? http + host + '/www/' : http + host + '/';
            var cur_tab = this.getTabs()[index];
            cur_tab.data = cur_tab.data || "none";
            var sel_value = $("#topic-selector").find(":selected").val();
            if (sel_value) {
                if (cur_tab.data !== sel_value) {
                    cur_tab.data = sel_value;
                var cur_tab_val = cur_tab.id.substr(4);
                // WIP this function is a repetition of the whatsnew_function
                // but the onBeforeClick event of the tabs doesn't take in the 
                // whatsnew_function correctly
                var inner_func = function() {
                    var address = site_address + cur_tab_val + "_gallery_macro";
                    var no_results = $("<div class='portalMessage informationMessage'><p>No results are available for this topic</p></div>");
                    var news = $("#whatsnew-gallery").find(".highlights:visible"); 
                var filter_topic = news.find(".filter-topic")[0],
                    filter_topic_text = "Filtered by <span>" + sel_text + "</span> topic";
                    filter_topic.innerHTML = sel_value ? filter_topic_text : "";
                    var gallery_ajax = $(".gallery-ajax", news);
                    var layout_selection = $('.gallery-layout-selection li a', news)[0];
                    gallery_ajax.load( address, {topic: sel_value, tab: cur_tab.data },  function(html) {
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
                window.setTimeout(inner_func, 50);
                }
            }
        });

        var host = window.location.host, http = 'http://',
            localhost = host.indexOf('localhost') != '-1' ? true : undefined,
            site_address = localhost ? http + host + '/www/' : http + host + '/';

        $topic_selector = $("#topic-selector");
        $topic_selector.find('[value="default"]').remove();
        $topic_selector.change(
            function displayResult() {
                var x = this.selectedIndex,
                    y = this.options;
                var topic_value = y[x].value,
                    topic_text = y[x].innerText;
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

