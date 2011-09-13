(function($) {
    $(function() {
        var search_forms = $("#portal-searchbox, #visual-column-wrapper").find(".searchforms");
        var text_inputs = search_forms.find("input:text");
        text_inputs.each( function() {
                var term = this;
                var search_label = this.title + "...";
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
        });

    });

})(jQuery);

