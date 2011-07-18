jQuery(function() { 
    jQuery("#highlights-middle").tabs("#highlights-middle div.highlightMiddle", {tabs: 'div.panel', effect: 'slide'});
    jQuery("ul#tabs").tabs("> .highlights");

    jQuery("#topic-selector").change(
        function displayResult()
        {
            var x = this.selectedIndex,
                y = this.options;
            var sel_value = y[x].value;
            var cur_tab_val = jQuery("#tabs a.current").text();
            var address = window.location.href + "ajax";
            var news = jQuery(".highlights").filter( function(index) { 
                 if ( this.style.display === "block") { return this; } 
            });
            news.load( address, {topic: sel_value, tab: cur_tab_val },  function(html) {
                news.tabs("div.highlightMiddle", {tabs: 'div.panel', effect: 'slide'});
            });
        }
    );
});
