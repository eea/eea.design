/* The table of contents portlet finds all h1, h2, h3, h4 tags inside
 * the #region-content div.
 */
function addHeaders(ul, hTag) {
    $('#region-content').find(hTag).not('.exclude-from-toc').each(function(i) {
        hText = $(this).html();
        hId = $(this).attr('id') || hTag + '-' + i;
        $(this).attr('id', hId);
        var li = $('<li><a href="#">' + hText + '</a></li>');
        var a = li.find('a');
        a.attr('href', '#' + hId);
        a.addClass('toc-' + hTag);
        ul.append(li)
    });
}

$(document).ready(function() {
    $('#document-toc').each(function() {
        $(this).show();
        var ul = $(this).find('.portletItem ul');
        addHeaders(ul, 'h2');
        addHeaders(ul, 'h3');
    })
})
