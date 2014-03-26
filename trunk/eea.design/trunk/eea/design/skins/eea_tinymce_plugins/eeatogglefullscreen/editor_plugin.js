(function () {

    function triggerEvent (node, type) {
        var evt;
        if (document.createEvent) {
            evt = document.createEvent('MouseEvents');
            evt.initEvent(type, true, false);
            node.dispatchEvent(evt);
        } else if (document.createEventObject) {
            node.fireEvent('on' + type);
        }
    }

    var debounce = function (func, threshold, execAsap) {
        //http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
        var timeout;
        return function debounced () {
            var obj = this;

            function delayed () {
                if (!execAsap)
                    func.apply(obj, arguments);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, arguments);

            timeout = setTimeout(delayed, threshold || 100);
        };

    };

    tinymce.create("tinymce.plugins.EEAToggleFullScreenPlugin", {
        init: function (d) {
            ed = d;
            var tinymce_container = document.getElementById('mce_fullscreen_container'),
                $tinymce_container,
                setHeight,
                debouncedSetHeight;

            if (tinymce_container) {
                tinymce_container.onclick = function (e) {
                    if (e.target.id === "mce_fullscreen_parent") {
                        var fullscreen_button = document.getElementById('mce_fullscreen_fullscreen');
                        tinymce_container.onclick = null;
                        triggerEvent(fullscreen_button, 'click');
                    }
                };
                $tinymce_container = $(tinymce_container);

                setHeight = function (evt) {
                    $tinymce_container.find('iframe').css({ 'height': $tinymce_container.height() - 85});
                };
                debouncedSetHeight = debounce(setHeight, 200, false);

                window.addEventListener('resize', debouncedSetHeight);
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
            var container = ed.getContainer();
            if (ed.getParam('fullscreen_for')) {
                if (!document.getElementById('mce_fullscreen_fullscreen')) {
                    $(body).focus(function () {
                        var fullscreen_button = container.querySelector('.mceButton.mce_fullscreen');
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
