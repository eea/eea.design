// jslint:disable
(function () {

    tinymce.create("tinymce.plugins.EEAToggleFullScreenPlugin", {
        init: function (ed) {
            var self = this;
            self.ed = ed;

            ed.addCommand("mceFullScreen", function () {
                var container = this.container;
                var $container = $(container);
                if (container.className.indexOf('mceFullScreen') === -1) {
                    $container.addClass("mceFullScreen")
                        .find('.mceLayout').addClass("mceFullScreen").end()
                        .find('.mce_fullscreen').addClass("mceButtonActive");
                    self.setHeight($container);
                    $(window).on('resize.fullscreenSetHeight', self.debouncedSetHeight());
                }
                else {
                    $container.removeClass("mceFullScreen")
                        .find('.mceLayout').removeClass("mceFullScreen").end()
                        .find('iframe').css('height', '').end()
                        .find('.mce_fullscreen').removeClass("mceButtonActive");

                    $(window).off('resize.fullscreenSetHeight');
                }
            });
            ed.addButton("fullscreen", {
                title: "fullscreen.desc",
                cmd: "mceFullScreen"
            });

            ed.onLoadContent.add(this.loadContent, this);

        },

        debounce: function (func, threshold, execAsap) {
            //http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
            var timeout;

            var obj = this;
            return function debounced () {

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

        },

        getInfo: function () {
            return {
                longname: "EEA Toggle Fullscreen",
                author: "David Ichim",
                authorurl: "http://tinymce.moxiecode.com",
                infourl: "http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/fullscreen",
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            }
        },

        setHeight: function () {
            $(this.ed.container).find('iframe').css({ 'height': $(window).height() - 110});
        },

        debouncedSetHeight: function () {
            return this.debounce(this.setHeight, 200, false);
        },

        loadContent: function (ed) {
            var body = ed.getBody();
            var container = ed.getContainer();

            if (container) {
                container.onclick = function (e) {
                    if (e.target.className.indexOf('mceEditor') !== -1) {
                        ed.execCommand('mceFullScreen');
                    }
                };
            }
            if (ed.getParam('fullscreen_for')) {
                if (container.className.indexOf('mceFullScreen') === -1) {
                    $(body).focus(function () {
                        if (container.className.indexOf('mceFullScreen') === -1) {
                            ed.execCommand('mceFullScreen');
                        }
                    });
                }
            }
        }
    });
    tinymce.PluginManager.add("eeatogglefullscreen", tinymce.plugins.EEAToggleFullScreenPlugin);
})();
