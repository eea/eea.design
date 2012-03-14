jQuery(document).ready(function($) {
    
    var subfolder_tabs = function(){
        var $content_core, $subfolders, $subfolder_h2,
            $subfolder_tabs = $("#eea-tabs");
        if ($subfolder_tabs.length){
            $content_core = $("#content");
            $subfolders = $content_core.find(".eea-tabs-panel");
            $subfolder_h2 = $subfolders.find('h2');
            // make width of tab bigger if the height of it
            // is bigger than 55px which is 2 rows
            var i = 0, length = $subfolder_h2.length;
            $subfolder_h2.appendTo($subfolder_tabs);
            $subfolder_tabs.tabs($subfolders);
            for(i; i < length; i += 1) {
                if($subfolder_h2[i].clientHeight > 59) {
                    $subfolder_h2[i].style.maxWidth = "152px";
                }
            }
        }
    };
    subfolder_tabs();

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
