/* The table of contents portlet finds all h1, h2, h3, h4 tags inside
 * the #region-content div.
 * - The script works with subheaders
 * - The script works with headers with nested <a> tags
 */
$(document).ready(function() {

    $('#document-toc').each(function() {
        var currentList = $(this).find('.portletItem ol');
        var hLevel = null;
        var lists = {'root': currentList};
        var queryString = $(this).find(' #queryString').html();

        $('#region-content').find(queryString).each(function(i, el) {
            var newLevel = parseInt(el.tagName.charAt(1));
            hLevel = hLevel || newLevel;

            if (newLevel > hLevel) {
                hLevel = newLevel;
                var newList = $('<ol></ol>');
                lists[newLevel] = newList;
                currentList.append(newList);
                currentList = newList;
            } else if (newLevel < hLevel) {
                hLevel = newLevel;
                currentList = lists[newLevel] || lists['root'];
            }

            var hText = $(el).find('a').text() || $(el).text();
            var li = $('<li><a>' + hText + '</a></li>');
            var hId = $(el).attr('id') || 'toc-' + i;
            var urlWithoutHash = location.protocol + '//' + location.host + location.pathname;
            li.find('a').attr('href', urlWithoutHash + '#' + hId);
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
    });

})
