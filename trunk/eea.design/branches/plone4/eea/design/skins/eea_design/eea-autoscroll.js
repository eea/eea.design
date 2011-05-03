// This JS autoscrolls the page down to the element classed
// "autoscroll-to-here" if one is found.
$(document).ready(function() {
    if ($('.autoscroll-to-here').length) {
        var top = $('.autoscroll-to-here').offset().top;
        $('html,body').animate({scrollTop: top}, 1000);
    }
});
