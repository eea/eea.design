var hash =  {}

function saveHash() {
    var s = ""
    for (var key in hash) {
        if (s.length) {
            s += '&';
        }
        s += key + '=' + hash[key];
    }
    window.location.hash = s;
}

function loadHash() {
    if (window.location.hash.length == 0) {
        return;
    }
    var items = window.location.hash.substring(1).split('&');
    for (var i = 0; i < items.length; i++) {
        var item = items[i].split('=');
        hash[item[0]] = item[1];
    }
}

$(document).ready(function() {

    loadHash();

    function loadContent(url) {
        $('#smart-view-content').html('<img src="++resource++faceted_images/ajax-loader.gif" />');
        $.get(url, function(data) {
            $('#smart-view-content').html(data);
        }, 'html');
    }

    $('#smart-view-switch a').click(function(e) {
        $('#smart-view-switch .selected').removeClass('selected');
        $(this).parent().addClass('selected');
        e.preventDefault();
        var template = $(this).attr('href');
        loadContent(template);
        hash['template'] = template;
        saveHash();
    });

    // Also handle click on any batch bar that will pop up
    $('.listingBar a').live('click', function(e) {
        e.preventDefault();
        loadContent($(this).attr('href'));
    });

    if ('template' in hash) {
        $('#smart-view-switch a[href=' + hash['template'] + ']').click();
    }

});
