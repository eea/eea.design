(function() {
    function triggerClick(node){
        if ( document.createEvent ) {
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('click', true, false);
            node.dispatchEvent(evt);
        } else if( document.createEventObject ) {
            node.fireEvent('onclick') ;
        } else if (typeof node.onclick == 'function' ) {
            node.onclick();
        }
    }
    tinymce.create("tinymce.plugins.EEAToggleFullScreenPlugin", {
        init: function(d, e) {
            ed = d;
            var tinymce_container = document.getElementById('mce_fullscreen_container');

            if ( tinymce_container) {
                tinymce_container.onclick = function(e) {
                    if (e.target.id === "mce_fullscreen_parent") {
                        var fullscreen_button = document.getElementById('mce_fullscreen_fullscreen');
                        tinymce_container.onclick = null;
                        triggerClick(fullscreen_button);
                    }
                };
            }

        },
        getInfo: function() {
            return {
                longname: "EEA Toggle Fullscreen",
                author: "Moxiecode Systems AB",
                authorurl: "http://tinymce.moxiecode.com",
                infourl: "http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/fullscreen",
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            }
        }

    });
    tinymce.PluginManager.add("eeatogglefullscreen", tinymce.plugins.EEAToggleFullScreenPlugin)
})();
