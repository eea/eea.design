/* The table of contents portlet finds all h1, h2, h3, h4 tags inside
 * the #region-content div.
 * - The script works with subheaders
 * - The script works with headers with nested <a> tags
 */
function build_toc(){
    (function($) {
    $('#document-toc').each(function() {
        var tocID = $(this).attr('id');
        var currentList = $(this).find('.portletItem ol');
        var hLevel = null;
        var lists = {'root': currentList};
        var queryString = $('#queryString').html();

        $('#region-content').find(queryString).each(function(i, el) {
            var newLevel = parseInt(el.tagName.charAt(1), 10);
            hLevel = hLevel || newLevel;

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

            /* Each header gets a 'back to table of contents' button. */
            if (!h.find('.back-to-toc-button').length) {
                var backButton = $('.eea-template.back-to-toc-button').clone();
                if (backButton.length) {
                    backButton.removeClass('eea-template');
                    backButton.attr('href', urlWithoutHash + "#" + tocID);
                    backButton.attr('title', "Back to table of contents");
                    backButton.appendTo(h);
                    h.addClass('header-with-go-back-button');
                }
            }
        });

        // The collapsable-portlet functionality should probably be moved to it's
        // own file, but I'm thinking maybe we should merge it with eea-accordion
        // in the future.
        $('.collapsable-portlet .portletHeader').click(function() {
            var portletClicked = $(this).parents('.portlet');
            portletClicked.toggleClass('collapsed');
        });
    });
    })(jQuery);
}

jQuery(document).ready(function($) {
    $('.clear-toc').each(function(){
        $('#document-toc dd.portletItem ol').empty();
    });
    build_toc();
    $('.clear-toc').removeClass('clear-toc');
});
