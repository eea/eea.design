/**
 * This JS displays a information/warning dialog about the environmental
 * affects of printing when pressing the print button either in document
 * actions or in IE. It looks for a #print-warning div in order to find the
 * actual text.
 *
 * #2791
 */

var warning_displayed = false;

window.onbeforeprint = function() {
    var warning_text = $.trim($("#print-warning p").html());
    if (warning_displayed === false) {
        alert(warning_text);
    }
};

$(document).ready(function() {
    $('#icon-print').parent().attr('href', '#').click(function() {
        var warning_text = $.trim($("#print-warning p").html());
        if (confirm(warning_text)) {
            warning_displayed = true;
            window.print();
        }
    });
});
