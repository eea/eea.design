(function($) {
    $(function() {
        var search_forms = $("#portal-searchbox, #visual-column-wrapper").find(".searchforms");
        var text_inputs = search_forms.find("input:text");
        text_inputs.each( function() {
                var search_label = this.title + "...";
                this.onfocus = function() {
                    if (this.value == search_label) {
                        this.value = "";
                    }
                };
                this.onblur = function() {
                    if (this.value === "") {
                        this.value = search_label;
                    }
                };
                this.value = search_label;
        });

    });

})(jQuery);

