// Patch keyword widget so that "New tags" and "Existing tags" will not overlap

jQuery(document).ready(function ($) {
    var keyword_widget = $("#fieldset-categorization #archetypes-fieldname-subject div");
    keyword_widget.attr('style', '');

    var textarea_widget = jQuery('textarea', keyword_widget);
    textarea_widget.attr('rows', 3);
});
