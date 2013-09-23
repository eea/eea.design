(function($) {

    $(document).ready(function() {
        var slide_portlet = $('.slidePortlet');
        if ( slide_portlet.length === 0 ) {
            return;
        }
        var body = $('body'),
            body_class = body.attr('class').match(/\bsoer/);
        /*
        $('#free-text-search input[type=submit]').click(function(e) {
            e.preventDefault();
            var searchTerm = $('#free-text-search input[type=text]').val();
            var url = window.location.href + '/advanced-search' + '#c4=' + searchTerm;
            window.location.href = url;
        });

        $('#geo-search input[type=submit]').click(function(e) {
            e.preventDefault();
            var keywords = $('#geo-search select').val();
            var url = window.location.href + '/advanced-search' + '#c3=' + keywords;
            window.location.href = url;
        });
        */

        /* SLIDE PORTLET */
        slide_portlet.each(function() {
            var portlet = $(this);
            var b1 = $('<span class="slideButton next"></span>');
            var b2 = $('<span class="slideButton prev"></span>');
            portlet.append(b1);
            portlet.append(b2);
            var play = $('<div class="slideButton play"></div>');
            portlet.append(play);
            // Start positions
        var items = portlet.find('.portletItem');
        var randomnumber=Math.floor(Math.random()*items.length);
        var elem = items[randomnumber];
        $(elem).addClass('selected');
        $(elem).css('left', 0);

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

                if (currentIndex === 0) {
                    return;
                }

                current.removeClass('selected');
                next.addClass('selected');

                var p = portlet.width() + 100;
                current.animate({'left': portlet.width() + 100});
                next.animate({'left': 0});
            });

            
            var playID;
            play.click( function() {
                var $this = $(this);
                if($this.hasClass('pause')) {
                    $this.removeClass('pause');
                    window.clearInterval(playID);
                }
                else {
                    $this.toggleClass('pause');
                    b1.click();
                    playID = window.setInterval(function() {
                        b1.click();}, 10000);
                }
            });

            if (body_class) {
                play.addClass('pause');
                playID = window.setInterval(function() {
                b1.click();}, 10000);
            }

       });
    });

})(jQuery);
