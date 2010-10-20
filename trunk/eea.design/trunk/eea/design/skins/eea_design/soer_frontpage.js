$(document).ready(function() {

    if ( $('body').hasClass('section-soer') == false ) {
        return;
    }

    $('#free-text-search input[type=submit]').click(function(e) {
        e.preventDefault();
        var searchTerm = $('#free-text-search input[type=text]').val();
        var url = $('#search-url').html() + '#c1=' + searchTerm;
        window.location.href = url;
    });

    $('#geo-search input[type=submit]').click(function(e) {
        e.preventDefault();
        var keywords = $('#geo-search select').val();
        var url = $('#search-url').html() + '#c3=' + keywords;
        window.location.href = url;
    });


    /* SLIDE PORTLET */

    $('.slidePortlet').each(function() {
        var portlet = $(this);
        var b1 = $('<button class="next">Next</button>');
        var b2 = $('<button class="prev">Prev</button>');
        portlet.append(b1);
        portlet.append(b2);

        // Start positions
        portlet.find('.portletItem').each(function(i, elem) {
            var p = i * portlet.width();
            p += 50; // 50 px just to be sure its outside
            if (i == 0) {
                p = 0;
            }
            $(elem).css('left', p);
        });

        portlet.find('.portletItem:first').addClass('selected');

        b1.click(function() {
            var current = portlet.find('.portletItem.selected');
            var next = current.next('.portletItem');

            var currentIndex = portlet.find('.portletItem').index(current);
            var nextIndex = portlet.find('.portletItem').index(next);

            // current.is(':last') did not work for some reason
            if (currentIndex+1 == portlet.find('.portletItem').length) {
                return;
            }

            current.removeClass('selected');
            next.addClass('selected');

            var p = (currentIndex - nextIndex) * portlet.width();
            current.animate({'left': p});
            next.animate({'left': 0});
        });

        b2.click(function() {
            var current = portlet.find('.portletItem.selected');
            var next = current.prev('.portletItem');

            var currentIndex = portlet.find('.portletItem').index(current);
            var nextIndex = portlet.find('.portletItem').index(next);

            if (currentIndex == 0) {
                return;
            }

            current.removeClass('selected');
            next.addClass('selected');

            var p = portlet.width() + 50;
            current.animate({'left': p});
            next.animate({'left': 0});
        });

    });

});
