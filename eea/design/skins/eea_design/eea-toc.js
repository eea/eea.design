/* The table of contents portlet finds all h1, h2, h3, h4 tags inside
 * the #region-content div. The script works with headers that have
 * <a> children.
 */
$(document).ready(function() {
    var currentList = $('#document-toc .portletItem ol');
    var hLevel = null;
    $('#region-content').find('h2, h3, h4').each(function(i, el) {
        var tagName = el.tagName.toLowerCase();
        var newLevel = parseInt(tagName[1]);
        hLevel = hLevel || newLevel;

        if (newLevel > hLevel) {
            hLevel = newLevel;
            var newList = $('<ol></ol>');
            currentList.append(newList);
            currentList = newList;
        }

        if (newLevel < hLevel) {
            hLevel = newLevel;
            currentList = currentList.parent();
        }

        var hText = $(el).find('a').text() || $(el).text();
        var hId = $(el).attr('id') || 'toc-' + i;
        var li = $('<li><a>' + hText + '</a></li>');
        currentList.append(li);
        li.find('a').attr('href', '#' + hId);
        $(el).attr('id', hId);
    });
})
