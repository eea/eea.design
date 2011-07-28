(function($) {
    $(function() { 
        /* $("#highlights-middle").tabs("#highlights-middle div.highlightMiddle", {tabs: 'div.panel', effect: 'slide'}); */
        $("#highlights-high, #highlights-middle").tabs("div.highlightMiddle", {tabs: 'div.panel', effect: 'slide'});
        $("ul#tabs").tabs("> .highlights");
        $("#topic-selector").change(
            function displayResult() {
                var x = this.selectedIndex,
                    y = this.options;
                var sel_value = y[x].value;
                var cur_tab_val = $("#tabs a.current").text();
                var address = window.location.href + "ajax";
                var news = $(".highlights").filter( function(index) { 
                     return this.style.display === "block"; 
                });
                news.load( address, {topic: sel_value, tab: cur_tab_val },  function(html) {
                    news.tabs("div.highlightMiddle", {tabs: 'div.panel', effect: 'slide'});
                });
            }
        );
    });

})(jQuery);
