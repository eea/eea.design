jQuery(document).ready(function($) {
    var eea_tabs = function(){
        var $whatsnew_gallery = $("#whatsnew-gallery");
        if($whatsnew_gallery.length) {
            return;
        }
        var $eea_tabs_title, $eea_tabs_title_a,
            $eea_tabs = $(".eea-tabs"), $eea_tabs_children;
        if ($eea_tabs.length){
            $eea_tabs_panels = $(".eea-tabs-panels");
            // detach tabs for dom manipulation
            $eea_tabs.detach();
            $eea_panels = $eea_tabs_panels.find(".eea-tabs-panel");
            $eea_panels.find('.eea-tabs-title').detach().appendTo($eea_tabs);

            $eea_tabs_children = $eea_tabs.children();
            var i = 0, tabs_length = $eea_tabs_children.length,
                $tab_title, tab_title_text;
            
            // the tabs need a link so we append a link if one is not found
            for(i; i < tabs_length; i += 1) {
                $tab_title = $($eea_tabs_children[i]);
                if(!$tab_title.find('a').length) { 
                    tab_title_text = $tab_title.text();
                    $tab_title.text("");
                    $('<a />').attr('href', '#').html(tab_title_text).appendTo($tab_title);
                }
            }
            
            $eea_tabs.tabs($eea_panels);
            $eea_tabs.insertBefore($eea_tabs_panels);

            // make width of tab bigger if the height of it
            // is bigger than 57px which is 2 rows
            var j = 0;
            for(j; j < tabs_length; j += 1) {
                if($eea_tabs_children[j].clientHeight > 57) {
                    $eea_tabs_children[j].style.maxWidth = "152px";
                }
            }
        }
    };
    eea_tabs();
});
