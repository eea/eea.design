(function () {

    function triggerEvent (node, type) {
        if (document.createEvent) {
            var evt = document.createEvent('MouseEvents');
            evt.initEvent(type, true, false);
            node.dispatchEvent(evt);
        } else if (document.createEventObject) {
            node.fireEvent('on' + type);
        }
    }

    tinymce.create("tinymce.plugins.EEAToggleFullScreenPlugin", {
        init: function (d) {
            ed = d;
            var tinymce_container = document.getElementById('mce_fullscreen_container');

            if (tinymce_container) {
                tinymce_container.onclick = function (e) {
                    if (e.target.id === "mce_fullscreen_parent") {
                        var fullscreen_button = document.getElementById('mce_fullscreen_fullscreen');
                        tinymce_container.onclick = null;
                        triggerEvent(fullscreen_button, 'click');
                    }
                };
            }
            ed.onLoadContent.add(this.loadContent, this);
        },
        getInfo: function () {
            return {
                longname: "EEA Toggle Fullscreen",
                author: "Moxiecode Systems AB",
                authorurl: "http://tinymce.moxiecode.com",
                infourl: "http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/fullscreen",
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            }
        },
        loadContent: function (ed) {
            var body = ed.getBody();
            if (!body.location) {
                if (!document.getElementById('mce_fullscreen_fullscreen')) {
                    $(body).click(function () {
                        var fullscreen_button = document.querySelector('.mce_fullscreen');
                        if (!document.getElementById('mce_fullscreen_fullscreen')) {
                            triggerEvent(fullscreen_button, 'click');
                        }
                    });
                }
            }
        }
    });
    tinymce.PluginManager.add("eeatogglefullscreen", tinymce.plugins.EEAToggleFullScreenPlugin);
})();
