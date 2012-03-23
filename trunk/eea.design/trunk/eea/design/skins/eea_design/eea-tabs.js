jQuery(document).ready(function($) {
    var eea_tabs = function(){
        if($("#whatsnew-gallery").length || $("#daviz-view").length) {
            return;
        }
        var $eea_tabs = $(".eea-tabs"), $eea_tabs_children;
        if ($eea_tabs.length){
            $eea_tabs_panels = $(".eea-tabs-panels");
            // detach tabs for dom manipulation
            $eea_tabs.detach();

            $eea_panels = $eea_tabs_panels.find(".eea-tabs-panel");
            // append eea-tabs-title elements if found in eea-tabs-panel
            $eea_panels.find('.eea-tabs-title').detach().appendTo($eea_tabs);

            $eea_tabs_children = $eea_tabs.children();
            var i = 0, tabs_length = $eea_tabs_children.length,
                $tab_title, tab_title_text;
            
            // the tabs need a link so we append a link if one is not found
            for(i; i < tabs_length; i += 1) {
                $tab_title = $($eea_tabs_children[i]);
                // IE 7 encloses surrounding elements withing the li so we
                // feed it p tags and convert it to li afterwards
                if($tab_title[0].tagName === "P") {
                    $tab_title.replaceWith("<li>" + $tab_title.html() + "</li>");  
                }
                if(!$tab_title.find('a').length) { 
                    tab_title_text = $tab_title.text();
                    $tab_title.text("");
                    $('<a />').attr('href', '#').html(tab_title_text).appendTo($tab_title);
                }
            }
            // redo children assigment since they could have been changed from
            // p to li
            $eea_tabs_children = $eea_tabs.children();
            $eea_tabs.tabs($eea_panels);
            $eea_tabs.insertBefore($eea_tabs_panels);

            // make width of tab bigger if the height of it
            // is bigger than first tab's height or make the first tab width
            // bigger if it's bigger than any of the tabs
            var j = 1, first_tab = $eea_tabs_children[0], first_tab_height, cur_tab;
            if(first_tab){
                first_tab_height = first_tab.clientHeight;
                for(j; j < tabs_length; j += 1) {
                    cur_tab = $eea_tabs_children[j];
                    if(cur_tab.clientHeight < first_tab_height) {
                        first_tab.style.maxWidth = "152px";
                    }
                    else if(cur_tab.clientHeight > first_tab_height) {
                        cur_tab.style.maxWidth = "152px";
                    }
                }
            }
        }
    };
    eea_tabs();
});
