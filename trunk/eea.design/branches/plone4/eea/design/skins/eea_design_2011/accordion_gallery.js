(function($) {
    $(function() { 
        $("#highlights-high, #highlights-middle").tabs("div.highlightMiddle", {tabs: 'div.panel', effect: 'slide'});
        $("ul#tabs").tabs("> .highlights");
        $("#topic-selector").change(
            function displayResult() {
                var x = this.selectedIndex,
                    y = this.options;
                var sel_value = y[x].value;
                var cur_tab_val = $("#tabs a.current").text().toLowerCase();
                var site_address = window.location.href;
                // remove any # or #items links from the link address 
                site_address = site_address.replace(/#\w*/, '')
                var news = $(".highlights").filter( function(index) { 
                     return this.style.display === "block"; 
                });
                var address = site_address + cur_tab_val + "_gallery_macro";
                var no_results = $("<p>No results are available for this topic</p>");
                news.load( address, {topic: sel_value, tab: cur_tab_val },  function(html) {
                    if (html.length > 1) {
                        if (cur_tab_val === "multimedia") {
                            $.getScript(site_address + "eea-mediacentre.js");
                        }
                    }
                    else {
                       no_results.appendTo(news);
                    }
                });
            }
        );
    });

})(jQuery);
