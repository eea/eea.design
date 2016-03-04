/*jslint browser: true,  */ /*global jQuery, SubCookieUtil */
jQuery(document).ready(function($) {
    window.whatsnew = {};
    var eea_gal = window.whatsnew;

    (function() {
        // get the site url from the base-url link
        eea_gal.site_address = $("base").attr("href");
        eea_gal.gallery = $("#whatsnew-gallery");
        eea_gal.gallery_page = eea_gal.gallery.attr("data-page");
    }());

    eea_gal.gallery_load = function(el, address, params, layout_selection) {

        el.load(address, params, function(html) {
            var album = el.find(".gallery-album");
            var listing = el.find(".gallery-listing");
            var layout = layout_selection || el.parent().find(".gallery-layout-selection li a")[0];
            if (html.length > 1) {
                if (layout && layout.className === "list-layout active-list") {
                    el.find('.gallery-album').addClass("hiddenStructure");
                    listing.hide().fadeIn("slow");
                }
                else {
                    el.find('.gallery-listing').addClass("hiddenStructure");
                    album.hide().fadeIn("slow");
                }
            }

        });
    };

    eea_gal.whatsnew_func = function(cur_tab_val, sel_text, sel_value, index, tag_title) {
        var address = eea_gal.site_address + cur_tab_val + "_gallery_macro";
        eea_gal.current_tab_addr = address;
        var gal = eea_gal.gallery.find(".eea-tabs-panel");
        var news = index ? gal[index] : gal.filter(function() {
            return this.style.display !== "none";
        });
        // workaround: we need the first highlights because when we click on the
        // first tab gal[0] returns the second highlights instead of
        // the first so we redefine news to the first found match if
        // index is 0
        news = index === 0 ? gal.first() : news;
        news = news[0] !== undefined ? news[0] : news;

        var gallery_ajax = $(".gallery-ajax", news);
        var layout_selection = $('.gallery-layout-selection li a', news)[0];
        var params = sel_value ? "topic" +  "=" + sel_value : undefined;
        params = tag_title ? "tags" +  "=" + sel_value : params;
        eea_gal.gallery_load(gallery_ajax, address, params, layout_selection);
    };

    var $topic_selector = $("#topic-selector");
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

            eea_gal.whatsnew_func('allproducts', topic_text, topic_value);
        });

    // selection of folder_summary_view or atct_album_view
    var layout_links = $(".gallery-layout-selection li a");
    layout_links.click(function(e) {
        var $this = $(this);
        var $parent = $this.parent();
        var $ajax = $this.closest("ul").next();
        var $hidden_gallery = $ajax.find(".hiddenStructure");
        var listing = $ajax.find('.gallery-listing');
        var album = $ajax.find('.gallery-album');
        var next = $parent.siblings().find("a");
        var link_class = $this[0].className;
        var highlight = $this.closest("div")[0].id;
        if (link_class === "list-layout active-list" || link_class === "album-layout active-album") {
            e.preventDefault();
            return;
        }
        var cookie_expires = new Date();
        cookie_expires.setMonth(cookie_expires.getMonth() + 1); // one month

        if (link_class.indexOf("list-layout") !== -1) {
            album.slideUp("slow");
            listing.slideDown("slow");
            $hidden_gallery.removeClass("hiddenStructure");
            $this.toggleClass("active-list");
            next.toggleClass("active-album");
            SubCookieUtil.set(eea_gal.gallery_page, highlight, "active-list", cookie_expires);
        }
        else {
            listing.slideUp("slow");
            album.slideDown("slow");
            $hidden_gallery.removeClass("hiddenStructure");
            $this.toggleClass("active-album");
            next.toggleClass("active-list");
            SubCookieUtil.set(eea_gal.gallery_page, highlight, "active-album", cookie_expires);
        }

        e.preventDefault();

    });

    // set layout depending on cookies
    if (eea_gal.gallery.length > 0) {
        var gallery_cookies = SubCookieUtil.getAll(eea_gal.gallery_page);
        if (gallery_cookies !== null) {
            eea_gal.gallery.find('.eea-tabs-panel').each(function() {
                var $this = $(this);
                var layouts = $this.find(".gallery-layout-selection li a");
                var $hidden_gallery = $this.find(".hiddenStructure");
                var link_listing = layouts.first();
                var link_album = layouts.last();
                var listing = $this.find(".gallery-listing");
                var album = $this.find(".gallery-album");
                var gallery_cookie = gallery_cookies[this.id];
                if (gallery_cookie !== null) {
                    if (gallery_cookie === "active-album") {
                        listing.hide();
                        album.show();
                        $hidden_gallery.removeClass("hiddenStructure");
                        link_listing.removeClass("active-list");
                        link_album.addClass("active-album");
                    }
                    else if (gallery_cookie === "active-list") {
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
