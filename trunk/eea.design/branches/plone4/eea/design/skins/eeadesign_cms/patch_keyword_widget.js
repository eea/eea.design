// Patch keyword widget so that "New tags" and "Existing tags" will not overlap

jQuery(document).ready(function ($) {
    var keyword_widget = $("#fieldset-categorization #archetypes-fieldname-subject div")[2];
    keyword_widget.style.cssText = '';

    var textarea_widget = keyword_widget.getElementsByTagName('textarea')[0];
    textarea_widget.rows = 3;
});

