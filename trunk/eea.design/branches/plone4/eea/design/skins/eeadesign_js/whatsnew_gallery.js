jQuery(document).ready(function($) {
    $("#highlights-high, #highlights-middle").tabs("div.highlightMiddle", {tabs: 'div.panel', effect: 'slide'});
    window.whatsnew = {};
    var eea_gal = window.whatsnew;

    (function() {
        var host = window.location.host, http = 'http://',
            localhost = host.indexOf('localhost') != '-1' ? true : undefined;
            /* site_address = localhost ? http + host + '/www/' : http + host + '/'; */
        eea_gal.site_address = localhost ? http + host + '/www/' : http + host + '/';
        eea_gal.gallery = $("#whatsnew-gallery");
        eea_gal.gallery_page = eea_gal.gallery.attr("data-page");
    })();

    eea_gal.whatsnew_func = function(cur_tab_val, sel_text, sel_value, index, tag_title) {
            var address = eea_gal.site_address + cur_tab_val + "_gallery_macro";
            var gal = eea_gal.gallery.find(".highlights");
            var news = index ? gal[index] : gal.filter(function() {return this.style.display !== 'none';});
            // workaround: we need the first highlights because when we click on the
            // first tab gal[0] returns the second highlights instead of
            // the first so we redefine news to the first found match if
            // index is 0
                news = index === 0 ? gal.first() : news;
                news = news[0] !== undefined ? news[0] : news;
            var filter_topic;
            filter_topic = news.firstElementChild !== undefined ? news.firstElementChild : news.firstChild;
            var filter_topic_text = "Filtered by <span>" + sel_text + "</span> topic";
                filter_topic.innerHTML = sel_value ? filter_topic_text : "";

            var gallery_ajax = $(".gallery-ajax", news);
            var layout_selection = $('.gallery-layout-selection li a', news)[0];
            var params = sel_value ? 'topic' + '=' + sel_value : undefined;
            params = tag_title ? 'tags' + '=' + sel_value : params;
            gallery_ajax.load( address, params, function(html) {
                var album = gallery_ajax.find('.gallery-album');
                var listing = gallery_ajax.find('.gallery-listing');
                if (html.length > 1) {
                    if (layout_selection.className === "list-layout active-list"){
                        gallery_ajax.find('.gallery-album').addClass('hiddenStructure');
                        listing.hide().fadeIn('slow');
                    }
                    else {
                        gallery_ajax.find('.gallery-listing').addClass('hiddenStructure');
                         album.hide().fadeIn('slow');
                    }
                }

            });
    };

    $("ul#tabs").tabs("> .highlights", function(event, index) {
        var cur_tab = this.getTabs()[index],
            cur_tab_val = cur_tab.id.substr(4);
            cur_tab.theme = cur_tab.theme || "none";
        var opt_item,
            sel_value,
            sel_text;
        opt_item = $("#topic-selector").find(":selected");
        if ( opt_item.length !== 0 ) {
            sel_value = opt_item.val();
            sel_text = opt_item.text();
        }
        else {
            opt_item = $("#topright-widgets").find('.selected').filter(':visible');
            sel_value = opt_item.length !== 0 ? opt_item[0].id.substr(3) : undefined;
            sel_text = opt_item.text();
            sel_value = sel_value !== 'all' ?  sel_value : '';
        }

        var highlight = $("#" + cur_tab_val + "-highlights");
        var listing = highlight.find('.gallery-listing');
        var listing_length =  listing.length !== 0 ? listing.children().length : 0;
        var notopics = highlight.find('.portalMessage'),
            notopics_length = notopics.length !== 0 ? 1 : 0;
        if (cur_tab.theme === sel_value && notopics_length !== 0) {
            return;
        }
        if (sel_text === "All topics" || listing_length === 0) {
            listing.html('<img src="++resource++faceted_images/ajax-loader.gif" />');
            eea_gal.whatsnew_func(cur_tab_val = cur_tab_val, sel_text = sel_text, sel_value = sel_value, index = index);
        }
        if (sel_value) {
            if (cur_tab.theme !== sel_value) {
                listing.html('<img src="++resource++faceted_images/ajax-loader.gif" />');
                cur_tab.theme = sel_value;
                eea_gal.whatsnew_func(cur_tab_val = cur_tab_val, sel_text = sel_text, sel_value = sel_value, index = index);
            }
        }
    });


    $topic_selector = $("#topic-selector");
    $topic_selector.find('[value="default"]').remove();
    $topic_selector.change(
        function displayResult() {
            // hide filter by topic after we choose a topic to filter the
            // results
            $topic_selector[0][0].className = "hiddenStructure";

            var x = this.selectedIndex,
                y = this.options;
            var topic_value = y[x].value,
                topic_text = y[x].innerHTML;
            var tab_val = $("#tabs a.current")[0].id.substr(4);

            eea_gal.whatsnew_func(cur_tab_val = tab_val, sel_text = topic_text, sel_value = topic_value);
        });

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
         var highlight = $this.closest('div')[0].id;
         if ( link_class === "list-layout active-list" || link_class === "album-layout active-album") {
             return false;
         }
         var cookie_expires = new Date();
            cookie_expires.setMonth(cookie_expires.getMonth() + 1); // one month

        if (link_class == "list-layout") {
            album.slideUp('slow');
            listing.slideDown('slow');
            $hidden_gallery.removeClass("hiddenStructure");
            $this.toggleClass("active-list");
            next.toggleClass("active-album");
            SubCookieUtil.set(eea_gal.gallery_page, highlight, "active-list", expires = cookie_expires);
            return false;
        }
        else {
            listing.slideUp('slow');
            album.slideDown('slow');
            $hidden_gallery.removeClass("hiddenStructure");
            $this.toggleClass("active-album");
            next.toggleClass("active-list");
            SubCookieUtil.set(eea_gal.gallery_page, highlight, "active-album", expires = cookie_expires);
            return false;
        }

    });

    // set layout depending on cookies
    if (eea_gal.gallery.length > 0) {
        var gallery_cookies = SubCookieUtil.getAll(eea_gal.gallery_page);
        if (gallery_cookies !== null) {
            eea_gal.gallery.find('.highlights').each(function(){
                var $this = $(this);
                var layouts = $this.find(".gallery-layout-selection li a");
                var $hidden_gallery = $this.find(".hiddenStructure");
                var link_listing = layouts.first();
                var link_album = layouts.last();
                var listing = $this.find('.gallery-listing');
                var album = $this.find('.gallery-album');
                var gallery_cookie = gallery_cookies[this.id];
                if (gallery_cookie !== null) {
                    if (gallery_cookie === "active-album") {
                        listing.hide();
                        album.show();
                        $hidden_gallery.removeClass("hiddenStructure");
                        link_listing.removeClass("active-list");
                        link_album.addClass("active-album");
                    }
                    else if (gallery_cookie === "active-list"){
                        listing.show();
                        album.hide();
                        $hidden_gallery.removeClass("hiddenStructure");
                        link_listing.addClass("active-list");
                        link_album.removeClass("active-album");
                    }
                }
            });
        }
    }
});


