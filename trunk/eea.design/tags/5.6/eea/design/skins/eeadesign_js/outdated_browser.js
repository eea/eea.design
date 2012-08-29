/*jslint browser: true,  */ /*global jQuery */
(function() {
    function badBrowser(){
        if(jQuery.browser.msie && parseInt(jQuery.browser.version, 10) <= 8){ return true;}
        return false;
    }

    function getBadBrowser(c_name)
    {
        var c_start, c_end;
        if (document.cookie.length > 0)
        {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start !== -1)
            {
            c_start = c_start + c_name.length+1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) { c_end = document.cookie.length; }
            return window.escape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }

    function setBadBrowser(c_name, value, expiredays)
    {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name+ "=" +window.escape(value) + ((expiredays === null) ? "" : ";expires=" + exdate.toGMTString());
    }

    if(badBrowser() && getBadBrowser('browserWarning') !== 'seen' ){
        jQuery(function(){
            window.setTimeout(function(){
                var outdated = jQuery("#outdated_wrap"), outdated_fade, timeout;
                outdated.prependTo("body").fadeIn(1000);
                outdated_fade = function(){
                    if(outdated.is(':visible')) {
                        setBadBrowser('browserWarning','seen', 2);
                        outdated.fadeOut(1000);
                    }
                };
                timeout = window.setTimeout(outdated_fade, 10000);
                outdated.hover(function(){
                    window.clearTimeout(timeout);
                }, function(){
                    outdated_fade();
                });
            }, 2000);
        });
    }
}());
