/* The table of contents portlet finds all h1, h2, h3, h4 tags inside
 * the #region-content div.
 * - The script works with subheaders
 * - The script works with headers with nested <a> tags
 */
$(document).ready(function() {
    var currentList = $('#document-toc .portletItem ol');
    var hLevel = null;
    var lists = {'root': currentList}
    $('#region-content').find('h2, h3, h4').each(function(i, el) {
        var newLevel = parseInt(el.tagName[1]);
        hLevel = hLevel || newLevel;

        if (newLevel > hLevel) {
            hLevel = newLevel;
            var newList = $('<ol></ol>');
            lists[newLevel] = newList;
            currentList.append(newList);
            currentList = newList;
        } else if (newLevel < hLevel) {
            hLevel = newLevel;
            currentList = lists[newLevel] || lists['root']
        }

        var hText = $(el).find('a').text() || $(el).text();
        var li = $('<li><a>' + hText + '</a></li>');
        var hId = $(el).attr('id') || 'toc-' + i;
        li.find('a').attr('href', location.href + '#' + hId);
        currentList.append(li);
        $(el).attr('id', hId);
    });

    // The collapsable-portlet functionality should probably be moved to it's
    // own file, but I'm thinking maybe we should merge it with eea-accordion
    // in the future.
    $('.collapsable-portlet .portletHeader').click(function() {
        var portletClicked = $(this).parents('.portlet');
        portletClicked.toggleClass('collapsed');
    });
})
