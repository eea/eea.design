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

});
