$(document).ready(function() {

    if ( !$('body').hasClass('section-soer') && !$('body').hasClass('section-soer-draft') ) {
        return;
    }

    $('#free-text-search input[type=submit]').click(function(e) {
        e.preventDefault();
        var searchTerm = $('#free-text-search input[type=text]').val();
        var url = window.location.href + '/search' + '#c1=' + searchTerm;
        window.location.href = url;
    });

    $('#geo-search input[type=submit]').click(function(e) {
        e.preventDefault();
        var keywords = $('#geo-search select').val();
        var url = window.location.href + '/search' + '#c3=' + keywords;
        window.location.href = url;
    });


    /* SLIDE PORTLET */

    $('.slidePortlet').each(function() {
        var portlet = $(this);
        var b1 = $('<span class="slideButton next"></span>');
        var b2 = $('<span class="slideButton prev"></span>');
        var play = $('<div class="slideButton play"></div>');
        portlet.append(b1);
        portlet.append(b2);
        portlet.append(play);

        // Start positions
        portlet.find('.portletItem').each(function(i, elem) {
            var p = i * portlet.width();
            p += 100; // 100 px just to be sure its outside
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

            current.animate({'left': -(portlet.width()+100)});
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

            var p = portlet.width() + 100;
            current.animate({'left': portlet.width() + 100});
            next.animate({'left': 0});
        });

	var playID;
        play.toggle(function() {
		$(this).attr('class', 'slideButton play pause')
		playID = setInterval(function() {
			b1.click();}, 3000);
	    }, function() {
		$(this).attr('class', 'slideButton play')
		clearInterval(playID);
	    });
		    
	});

});

