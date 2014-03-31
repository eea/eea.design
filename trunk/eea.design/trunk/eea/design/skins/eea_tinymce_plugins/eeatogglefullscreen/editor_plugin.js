// jslint:disable

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

//          if (ed.getParam('fullscreen_for')) {
            ed.addCommand("mceFullScreen", function() {
                var container =  this.container;
                var $container = $(container);
                if (container.className.indexOf('mceFullScreen') === -1) {
                    $container.addClass("mceFullScreen")
                        .find('.mceLayout').addClass("mceFullScreen").end()
                        .find('.mce_fullscreen').addClass("mceButtonActive");
                }
                else  {
                    $container.removeClass("mceFullScreen")
                        .find('.mceLayout').removeClass("mceFullScreen").end()
                        .find('.mce_fullscreen').removeClass("mceButtonActive");
                }
            });
            ed.addButton("fullscreen", {
                title: "fullscreen.desc",
                cmd: "mceFullScreen"
            });
//          }

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
            var tinymce_container = ed.getContainer(),
                container = tinymce_container,
                $tinymce_container,
                setHeight,
                debouncedSetHeight;

            if (tinymce_container) {
                tinymce_container.onclick = function (e) {
                    if (e.target.className.indexOf('mceEditor') !== -1) {
                        ed.execCommand('mceFullScreen');
                    }
                };
                $tinymce_container = $(tinymce_container);

                setHeight = function (evt) {
                    $tinymce_container.find('iframe').css({ 'height': $tinymce_container.height() - 85});
                };
                debouncedSetHeight = debounce(setHeight, 200, false);

                window.addEventListener('resize', debouncedSetHeight);
            }
            if (ed.getParam('fullscreen_for')) {
                if (container.className.indexOf('mceFullScreen') === -1) {
                    $(body).click(function () {
                        var fullscreen_button = container.querySelector('.mceButton.mce_fullscreen');
                        if (container.className.indexOf('mceFullScreen') === -1) {
                            triggerEvent(fullscreen_button, 'click');
                        }
                    });
                }
            }
        }
    });
    tinymce.PluginManager.add("eeatogglefullscreen", tinymce.plugins.EEAToggleFullScreenPlugin);
})();
