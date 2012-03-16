jQuery(document).ready(function($) {
    
    var eea_tabs = function(){
        var $eea_tabs_title, $eea_tabs_title_a,
            $eea_tabs = $("#eea-tabs"), $eea_tabs_children;
        if ($eea_tabs.length){
            $eea_tabs_panels = $("#eea-tabs-panels");
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
            // is bigger than 55px which is 2 rows
            var j = 0;
            for(j; j < tabs_length; j += 1) {
                if($eea_tabs_children[j].clientHeight > 60) {
                    $eea_tabs_children[j].style.maxWidth = "152px";
                }
            }
        }
    };
    eea_tabs();

    var $folder_panels = $('#eea-accordion-panels');
    if($folder_panels.length) {
     $($folder_panels).tabs(
        "#eea-accordion-panels div.pane",
        {tabs: 'h2', effect: 'slide', initialIndex: 0}
      );
    }

    if ($('#smart-view-switch').length) {
       var markSelectedButton = function () {
            var smartTemplate = $.bbq.getState('smartTemplate');
            $('#smart-view-switch .selected').removeClass('selected');
            $('#smart-view-switch li').each(function(i) {
                var templateID = $.trim($(this).text());
                if (templateID == smartTemplate) {
                    $(this).addClass('selected');
                }
            });
        };

      var loadCookieSetttings =  function() {
            if ($.bbq.getState('smartTemplate') === undefined && readCookie('smartTemplate')) {
                $.bbq.pushState({
                    'smartTemplate': readCookie('smartTemplate')
                });
            }
        };

     var loadContent = function() {
            $('#smart-view-content').html('<img src="++resource++faceted_images/ajax-loader.gif" />');
            var url = $.param.querystring($.bbq.getState('smartTemplate'), $.param.querystring());
            $.get(url, function(data) {
                $('#smart-view-content').html(data);
                subfolder_tabs();
                $('.listingBar a').each(function(i) {
                    var batchQueryString = $.param.querystring($(this).attr('href'));
                    var newUrl = $.param.querystring(location.href, batchQueryString);
                    $(this).attr('href', newUrl);
                });
            }, 'html');
        };

        $('#smart-view-switch li').live('click', function(e) {
            var smartTemplate = $(this).find('.template-id').text();
            $.bbq.pushState({
                'smartTemplate': smartTemplate
            });
            // #3370 - IE7 does not pick up on hash changes
            var ie6or7 = $.browser.msie && (parseInt($.browser.version, 10) <= 7);
            if (window.Faceted) {
                if (Faceted.Window.width && ie6or7) {
                    Faceted.Query = Faceted.URLHandler.hash2query(location.hash);
                    $(Faceted.Events).trigger(Faceted.Events.QUERY_CHANGED);
                    Faceted.Form.do_form_query();
                }
            }
            createCookie('smartTemplate', smartTemplate);
        });

        loadCookieSetttings();

        $(window).bind('hashchange', function(e) {
            // If faceted navigation is enabled, we don't have to make our own
            // AJAX request.
            if (window.Faceted) {
                if (!Faceted.Window.width && ($.bbq.getState('smartTemplate') !== undefined)) {
                    markSelectedButton();
                    loadContent();
                }
            }
        }).trigger('hashchange');
    }
});
