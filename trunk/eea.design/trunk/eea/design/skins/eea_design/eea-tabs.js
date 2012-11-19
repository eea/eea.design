jQuery(document).ready(function($) {
    var eea_tabs = function(){
        if($("#whatsnew-gallery").length || $("#daviz-view").length) {
            return;
        }
        var $eea_tabs = $(".eea-tabs"), eea_tabs_length = $eea_tabs.length, $eea_tabs_children,
            $eea_tabs_panels = $(".eea-tabs-panels"), i = 0;
        if (eea_tabs_length){
            for (i; i < eea_tabs_length; i += 1) {
                $eea_tab = $eea_tabs.eq(i);
                // detach tab for dom manipulation
                $eea_tab.detach();
                $eea_tabs_panel = $eea_tabs_panels.eq(i);

                $eea_panels = $eea_tabs_panel.children();
                // append eea-tabs-title elements if found in eea-tabs-panel
                $eea_panels.find('.eea-tabs-title').detach().appendTo($eea_tab);

                $eea_tab_children = $eea_tab.children();
                var j = 0, tabs_length = $eea_tab_children.length,
                    $tab_title, tab_title_text;
                
                // the tabs need a link so we append a link if one is not found
                for(j; j < tabs_length; j += 1) {
                    $tab_title = $($eea_tab_children[j]);
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
                $eea_tab_children = $eea_tab.children();
                $eea_tab.tabs($eea_panels);
                $eea_tab.insertBefore($eea_tabs_panel);

                // make width of tab bigger if the height of it
                // is bigger than first tab's height or make the first tab width
                // bigger if it's bigger than any of the tabs
                var k = 1, first_tab = $eea_tab_children[0], first_tab_height, cur_tab;
                if(first_tab){
                    first_tab_height = first_tab.clientHeight;
                    for(k; k < tabs_length; k += 1) {
                        cur_tab = $eea_tab_children[k];
                        if(cur_tab.clientHeight < first_tab_height) {
                            first_tab.style.maxWidth = "152px";
                        }
                        else if(cur_tab.clientHeight > first_tab_height) {
                            cur_tab.style.maxWidth = "125px";
                        }
                    }
                }
            }
        }
    };
    window.EEA = window.EEA || {};
    // expose eea_tabs function to the global window for reuse in other scripts
    window.EEA.eea_tabs = eea_tabs;
    eea_tabs();
});
