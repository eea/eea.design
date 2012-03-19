/* The table of contents portlet finds all h1, h2, h3, h4 tags inside
 * the #region-content div.
 * - The script works with subheaders
 * - The script works with headers with nested <a> tags
 */
function build_toc(toc) {
    var tocID = toc.attr('id');

    // add collapsabl-portlet class to get the arrows to minimize the panel
    if (!toc.hasClass('collapsable-portlet')){
        toc.addClass('collapsable-portlet');
    }

    var currentList = toc.find('.portletItem');
    var hLevel = null;
    var lists = {'root': currentList};
    // detach dom element to avoid extra repaints
    lists.root.detach();
    var queryString = $('#queryString').html();
        queryString = queryString || "h2, h3, h4";

    $('#content-core').find(queryString).each(function(i, el) {
        var newLevel = parseInt(el.tagName.charAt(1), 10);
        hLevel = hLevel || newLevel;
        if(el.className === "notoc") {
            return;
        }

        if (newLevel > hLevel) {
            hLevel = newLevel;
            var newList = $('<ol></ol>');
            lists[newLevel] = newList;
            currentList.append(newList);
            currentList = newList;
        } else if (newLevel < hLevel) {
            hLevel = newLevel;
            currentList = lists[newLevel] || lists.root;
        }

        var h = $(el);
        var hText = $.trim(h.find('a').text()) || h.text();
        var li = $('<li><a>' + hText + '</a></li>');
        var hId = h.attr('id') || 'toc-' + i;
        var urlWithoutHash = location.protocol + '//' + location.host + location.pathname;
        li.find('a').attr('href', urlWithoutHash + '#' + hId);
        currentList.append(li);
        h.attr('id', hId);

    });

    // reatach portlet item and show toc since it is hidden by default 
    lists.root.appendTo(toc);
    toc.show();

    // The collapsable-portlet functionality should probably be moved to it's
    // own file, but I'm thinking maybe we should merge it with eea-accordion
    // in the future.
    toc.find('.portletHeader').click(function() {
        toc.toggleClass('collapsed');
    });
/* }); */
}

jQuery(document).ready(function($) {
    var $document_toc  = $('#document-toc');
    if($document_toc.length){
        build_toc($document_toc);
    }
});

