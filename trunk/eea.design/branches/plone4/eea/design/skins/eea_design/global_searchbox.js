// This script adds the description label to the search textfield.
// We can't use jQuery here due to JS library conflicts in some
// sites using EEATemplateService. #2455

function global_searchbox_init() {
    var form = document.getElementById('searchbox_terminology');
    if (form === null) {
        return;
    }
    var term = form.term;
    var search_label = term.title + "...";
    term.onfocus = function() {
        if (this.value == search_label) {
            this.value = "";
        }
    };
    term.onblur = function() {
        if (this.value === "") {
            this.value = search_label;
        }
    };
    term.value = search_label;
}

registerPloneFunction(global_searchbox_init);
