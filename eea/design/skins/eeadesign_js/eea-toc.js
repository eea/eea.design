/* The table of contents portlet finds all h1, h2, h3, h4 tags inside
 * the #content-core div.
 * - The script works with subheaders
 * - The script works with headers with nested <a> tags
 */
function build_toc(toc) {
    // add collapsible-portlet class to get the arrows to minimize the panel
    if (!toc.hasClass("collapsable-portlet")) {
        toc.addClass("collapsable-portlet");
    }
    var currentList = toc.find(".portletItem");
    var hLevel = null;
    var lists = { root: currentList };
    // detach dom element to avoid extra repaints
    lists.root.detach();
    var queryString = $("#queryString").html();
    queryString = queryString || "h2, h3, h4";
    var tocExclude = $("#exclude-toc").data("exclude");
    if (tocExclude) {
        try {
            tocExclude = tocExclude.trim();
            $("#content-core").find(tocExclude).addClass("notoc");
        } catch (err) {
            if (window.console) {
                window.console.log(err);
            }
        }
    }
    $("#content-core")
        .find(queryString)
        .each(function (i, el) {
            var newLevel = parseInt(el.tagName.charAt(1), 10);
            hLevel = hLevel || newLevel;
            if (el.className.indexOf("notoc") !== -1) {
                return;
            }
            if (newLevel > hLevel) {
                hLevel = newLevel;
                var newList = $("<ol></ol>");
                lists[newLevel] = newList;
                currentList.children().last().append(newList);
                currentList = newList;
            } else if (newLevel < hLevel) {
                hLevel = newLevel;
                currentList = lists[newLevel] || lists.root;
            }
            var h = $(el);
            var hText = $.trim(h.find("a").text()) || h.text();
            var li = $("<li><a>" + hText + "</a></li>");
            var hId = h.attr("id") || "toc-" + i;
            var urlWithoutHash =
                location.protocol + "//" + location.host + location.pathname;
            li.find("a").attr("href", urlWithoutHash + "#" + hId);
            currentList.append(li);
            h.attr("id", hId);
        });
    var $toc_children = lists.root.children();
    var $first_child = $toc_children.eq(0);
    if ($first_child.is("ol") && !$first_child.children().length) {
        $toc_children = $toc_children.slice(1, $toc_children.length);
        $toc_children.appendTo($first_child);
        lists.root.empty();
        $first_child.appendTo(lists.root);
    }
    if (!$first_child.is("ol")) {
        $toc_children.wrapAll("<ol />");
    }
    // reatach portlet item and show toc since it is hidden by default
    lists.root.appendTo(toc);
    toc.show();
    /* #123625 scroll into view if hash is present after we finish the addition of ids on headers */
    var hash = window.location.hash;
    var toc_element = document.getElementById(hash);
    if (hash.length) {
        if (toc_element) {
            toc_element.scrollIntoView();
        }
    }
    // The collapsable-portlet functionality should probably be moved to it's
    // own file, but I'm thinking maybe we should merge it with eea-accordion
    // in the future.
}
jQuery(document).ready(function ($) {
    var $document_toc = $("#document-toc");
    if ($document_toc.length) {
        build_toc($document_toc);
        var $portlet_header = $document_toc.find(".portletHeader");
        $portlet_header.click(function () {
            $document_toc.toggleClass("collapsed");
        });
    }
});
