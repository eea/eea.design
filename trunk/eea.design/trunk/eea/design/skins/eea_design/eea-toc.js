/* The table of contents portlet finds all h1, h2, h3, h4 tags inside
 * the #region-content div.
 */
$(document).ready(function() {
    var currentList = $('#document-toc .portletItem ol');
    var hLevel = 1;
    $('#region-content').find('h1, h2, h3, h4').each(function(i, el) {
        var tagName = el.tagName.toLowerCase();
        var newLevel = parseInt(tagName[1]);

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
        var hId = 'toc-' + i;
        var li = $('<li><a>' + hText + '</a></li>');
        currentList.append(li);
        li.find('a').attr('href', '#' + hId);
        $(el).attr('id', hId);
    });
})
