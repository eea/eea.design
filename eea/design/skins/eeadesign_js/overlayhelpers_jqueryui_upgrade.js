/* jslint:disable */
/*jslint browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, newcap: true, immed: true, regexp: true, white:true */
/*global jQuery, ajax_noresponse_message, close_box_message, window */
/* jQuery code from source to provide buildFragments #105112 */

var class2type = {};
function Data() {
    this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;
var dataPriv = new Data();
var rscriptType = (/^$|^module$|\/(?:java|ecma)script/i);

function getAll(context, tag) {

    // Support: IE <=9 - 11 only
    // Use typeof to avoid zero-argument method invocation on host objects (#15151)
    var ret;

    if (typeof context.getElementsByTagName !== "undefined") {
        ret = context.getElementsByTagName(tag || "*");

    } else if (typeof context.querySelectorAll !== "undefined") {
        ret = context.querySelectorAll(tag || "*");

    } else {
        ret = [];
    }

    if (tag === undefined || tag && nodeName(context, tag)) {
        return jQuery.merge([context], ret);
    }

    return ret;
}

function toType(obj) {
    if (obj == null) {
        return obj + "";
    }

    // Support: Android <=2.3 only (functionish RegExp)
    return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
}

function setGlobalEval(elems, refElements) {
    var i = 0,
        l = elems.length;

    for (; i < l; i++) {
        dataPriv.set(
            elems[i], "globalEval", !refElements || dataPriv.get(refElements[i], "globalEval"));
    }
}

function nodeName(elem, name) {

    return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}

var isAttached = function(elem) {
    return jQuery.contains(elem.ownerDocument, elem);
};

var wrapMap = {

    // Support: IE <=9 only
    option: [1, "<select multiple='multiple'>", "</select>"],

    // XHTML parsers do not magically insert elements in the
    // same way that tag soup parsers do. So we cannot shorten
    // this by omitting <tbody> or other required elements.
    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],

    _default: [0, "", ""]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

$.buildFragment = function(elems, context, scripts, selection, ignored) {
    var elem, tmp, tag, wrap, attached, j,
        fragment = context.createDocumentFragment(),
        nodes = [],
        i = 0,
        l = elems.length;

    var rtagName = (/<([a-z][^\/\0>\x20\t\r\n\f]*)/i),
        rhtml = /HTML$/i;
    for (; i < l; i++) {
        elem = elems[i];

        if (elem || elem === 0) {

            // Add nodes directly
            if (toType(elem) === "object") {

                // Support: Android <=4.0 only, PhantomJS 1 only
                // push.apply(_, arraylike) throws on ancient WebKit
                jQuery.merge(nodes, elem.nodeType ? [elem] : elem);

                // Convert non-html into a text node
            } else if (!rhtml.test(elem)) {
                nodes.push(context.createTextNode(elem));

                // Convert html into DOM nodes
            } else {
                tmp = tmp || fragment.appendChild(context.createElement("div"));

                // Deserialize a standard representation
                tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
                wrap = wrapMap[tag] || wrapMap._default;
                tmp.innerHTML = wrap[1] + jQuery.htmlPrefilter(elem) + wrap[2];

                // Descend through wrappers to the right content
                j = wrap[0];
                while (j--) {
                    tmp = tmp.lastChild;
                }

                // Support: Android <=4.0 only, PhantomJS 1 only
                // push.apply(_, arraylike) throws on ancient WebKit
                jQuery.merge(nodes, tmp.childNodes);

                // Remember the top-level container
                tmp = fragment.firstChild;

                // Ensure the created nodes are orphaned (#12392)
                tmp.textContent = "";
            }
        }
    }

    // Remove wrapper from fragment
    fragment.textContent = "";

    i = 0;
    while ((elem = nodes[i++])) {

        // Skip elements already in the context collection (trac-4087)
        if (selection && jQuery.inArray(elem, selection) > -1) {
            if (ignored) {
                ignored.push(elem);
            }
            continue;
        }

        attached = isAttached(elem);

        // Append to fragment
        tmp = getAll(fragment.appendChild(elem), "script");

        // Preserve script evaluation history
        if (attached) {
            setGlobalEval(tmp);
        }

        // Capture executables
        if (scripts) {
            j = 0;
            while ((elem = tmp[j++])) {
                if (rscriptType.test(elem.type || "")) {
                    scripts.push(elem);
                }
            }
        }
    }

    return fragment;
};
/* end #105112 fix */


// Name space object for pipbox
var pb = {spinner: {}, overlay_counter: 1};

jQuery.tools.overlay.conf.oneInstance = false;

(function($) {
    // override jqt default effect to take account of position
    // of parent elements
    jQuery.tools.overlay.addEffect('default',
        function(pos, onLoad) {
            var conf = this.getConf(),
                w = $(window),
                ovl = this.getOverlay(),
                op = ovl.parent().offsetParent().offset();

            if (!conf.fixed)  {
                pos.top += w.scrollTop() - op.top;
                pos.left += w.scrollLeft() - op.left;
            }

            pos.position = conf.fixed ? 'fixed' : 'absolute';
            ovl.css(pos).fadeIn(conf.speed, onLoad);

        }, function(onClose) {
            this.getOverlay().fadeOut(this.getConf().closeSpeed, onClose);
        }
    );

    pb.spinner.show = function () {
        $('body').css('cursor', 'wait');
    };
    pb.spinner.hide = function () {
        $('body').css('cursor', '');
    };
}) (jQuery);



jQuery(function ($) {

    // buildfragment needed
    /******
     $.fn.prepOverlay jQuery plugin to inject overlay target into DOM and
     annotate it with the data we'll need in order to display it.
     ******/
    $.fn.prepOverlay = function (pba) {
        return this.each(function () {
            var o, pbo, config, onBeforeLoad, onLoad, src, parts;

            o = $(this);

            // copy options so that it's not just a reference
            // to the parameter.
            pbo = $.extend(true, {'width':'60%'}, pba);

            // set overlay configuration
            config = pbo.config || {};

            // set onBeforeLoad handler
            onBeforeLoad = pb[pbo.subtype];
            if (onBeforeLoad) {
                config.onBeforeLoad = onBeforeLoad;
            }
            onLoad = config.onLoad;
            config.onLoad = function () {
                if (onLoad) {
                    onLoad.apply(this, arguments);
                }
                pb.fi_focus(this.getOverlay());
            };

            // be promiscuous, pick up the url from
            // href, src or action attributes
            src = o.attr('href') || o.attr('src') || o.attr('action');

            // translate url with config specifications
            if (pbo.urlmatch) {
                src = src.replace(new RegExp(pbo.urlmatch), pbo.urlreplace);
            }

            if (pbo.subtype === 'inline') {
                // we're going to let tools' overlay do all the real
                // work. Just get the markers in place.
                src = src.replace(/^.+#/, '#');
                $("[id='" + src.replace('#', '') + "']").addClass('overlay');
                o.removeAttr('href').attr('rel', src);
                // use overlay on the source (clickable) element
                o.overlay();
            } else {
                // save various bits of information from the pbo options,
                // and enable the overlay.

                // this is not inline, so in one fashion or another
                // we'll be loading it via the beforeLoad callback.
                // create a unique id for a target element
                pbo.nt = 'pb_' + pb.overlay_counter;
                pb.overlay_counter += 1;

                pbo.selector = pbo.filter || pbo.selector;
                if (!pbo.selector) {
                    // see if one's been supplied in the src
                    parts = src.split(' ');
                    src = parts.shift();
                    pbo.selector = parts.join(' ');
                }

                pbo.src = src;
                pbo.config = config;
                pbo.source = o;

                // remove any existing overlay and overlay handler
                pb.remove_overlay(o);

                // save options on trigger element
                jQuery(o).data('pbo', pbo);

                // mark the source with a rel attribute so we can find
                // the overlay, and a special class for styling
                o.attr('rel', '#' + pbo.nt);
                o.addClass('link-overlay');

                // for some subtypes, we're setting click handlers
                // and attaching overlay to the target element. That's
                // so we'll know the dimensions early.
                // Others, like iframe, just use overlay.
                switch (pbo.subtype) {
                    case 'image':
                        o.click(pb.image_click);
                        break;
                    case 'ajax':
                        o.click(pb.ajax_click);
                        break;
                    case 'iframe':
                        pb.create_content_div(pbo);
                        o.overlay(config);
                        break;
                    default:
                        throw "Unsupported overlay type";
                }

                // in case the click source wasn't
                // already a link.
                o.css('cursor', 'pointer');
            }
        });
    };


    /******
     pb.remove_overlay
     Remove the overlay and handler associated with a jquery wrapped
     trigger object
     ******/
    pb.remove_overlay = function (o) {
        var old_data = jQuery(o).data('pbo');

        if (old_data) {
            switch (old_data.subtype) {
                case 'image':
                    o.unbind('click', pb.image_click);
                    break;
                case 'ajax':
                    o.unbind('click', pb.ajax_click);
                    break;
                default:
                    // it's probably the jqt overlay click handler,
                    // but we don't know the handler and are forced
                    // to do a generic unbind of click handlers.
                    o.unbind('click');
                    break;
            }
            if (old_data.nt) {
                $('#' + old_data.nt).remove();
            }
        }
    };


    /******
     pb.create_content_div
     create a div to act as an overlay; append it to
     the body; return it
     ******/
    pb.create_content_div = function (pbo, trigger) {
        var content,
            close_message,
            top,
            pbw = pbo.width;

        if (typeof(close_box_message) === 'undefined') {
            close_message = 'Close this box.';
        } else {
            close_message = close_box_message;
        }

        content = $('' +
            '<div id="' + pbo.nt +
            '" class="overlay overlay-' + pbo.subtype +
            ' ' + (pbo.cssclass || '') +
            '"><div class="close"><a href="#" class="hiddenStructure" title="Close this box">' +
            close_message +
            '</a></div></div>');

        jQuery(content).data('pbo', pbo);

        // if a width option is specified, set it on the overlay div,
        // computing against the window width if a % was specified.
        if (pbw) {
            if (pbw.indexOf('%') > 0) {
                content.width(parseInt(pbw, 10) / 100 * $(window).width());
            } else {
                content.width(pbw);
            }
        }

        // add the target element at the end of the body.
        content.appendTo($("body"));

        return content;
    };


    /******
     pb.image_click
     click handler for image loads
     ******/
    pb.image_click = function (event) {
        var ethis, content, api, img, el, pbo;

        ethis = $(this);
        pbo = jQuery(ethis).data('pbo');

        // find target container
        content = $(ethis.attr('rel'));
        if (!content.length) {
            content = pb.create_content_div(pbo);
            content.overlay(pbo.config);
        }
        api = content.overlay();

        // is the image loaded yet?
        if (content.find('img').length === 0) {
            // load the image.
            if (pbo.src) {
                pb.spinner.show();

                // create the image and stuff it
                // into our target
                img = new Image();
                img.src = pbo.src;
                el = $(img);
                content.append(el.addClass('pb-image'));

                // Now, we'll cause the overlay to
                // load when the image is loaded.
                el.load(function () {
                    pb.spinner.hide();
                    api.load();
                });

            }
        } else {
            api.load();
        }

        return false;
    };


    /******
     pb.fi_focus
     First-input focus inside $ selection.
     ******/
    pb.fi_focus = function (jqo) {
        if (! jqo.find("form div.error :input:first").focus().length) {
            jqo.find("form :input:visible:first").focus();
        }
    };


    /******
     pb.ajax_error_recover
     jQuery's ajax load function does not load error responses.
     This routine returns the cooked error response.
     ******/
    pb.ajax_error_recover = function (responseText, selector) {
        var tcontent = $('<div/>').append(
            responseText.replace(/<script(.|\s)*?\/script>/gi, ""));
        return selector ? tcontent.find(selector) : tcontent;
    };


    /******
     pb.add_ajax_load
     Adds a hidden ajax_load input to form
     ******/
    pb.add_ajax_load = function (form) {
        if (form.find('input[name=ajax_load]').length === 0) {
            form.prepend($('<input type="hidden" name="ajax_load" value="' +
                (new Date().getTime()) +
                '" />'));
        }
    };

    /******
     pb.prep_ajax_form
     Set up form with ajaxForm, including success and error handlers.
     ******/
    pb.prep_ajax_form = function (form) {
        var ajax_parent = form.closest('.pb-ajax'),
            data_parent = ajax_parent.closest('.overlay-ajax'),
            pbo = jQuery(data_parent).data('pbo'),
            formtarget = pbo.formselector,
            closeselector = pbo.closeselector,
            beforepost = pbo.beforepost,
            afterpost = pbo.afterpost,
            noform = pbo.noform,
            api = data_parent.overlay(),
            selector = pbo.selector,
            options = {};

        options.beforeSerialize = function () {
            pb.spinner.show();
        };

        if (beforepost) {
            options.beforeSubmit = function (arr, form, options) {
                return beforepost(form, arr, options);
            };
        }
        options.success = function (responseText, statusText, xhr, form) {
            $(document).trigger('formOverlayStart', [this, responseText, statusText, xhr, form]);
            // success comes in many forms, some of which are errors;
            //

            var el, myform, success, target, scripts = [];

            success = statusText === "success" || statusText === "notmodified";

            if (! success) {
                // The responseText parameter is actually xhr
                responseText = responseText.responseText;
            }
            // strip inline script tags
            filteredResponseText = responseText.replace(/<script(.|\s)*?\/script>/gi, "");

            // create a div containing the optionally filtered response
            el = $('<div />').append(
                selector ?
                    // a lesson learned from the jQuery source: $(responseText)
                    // will not work well unless responseText is well-formed;
                    // appending to a div is more robust, and automagically
                    // removes the html/head/body outer tagging.
                    $('<div />').append(filteredResponseText).find(selector)
                    :
                    filteredResponseText
            );

            // afterpost callback
            if (success && afterpost) {
                afterpost(el, data_parent);
            }

            myform = el.find(formtarget);
            if (success && myform.length) {
                ajax_parent.empty().append(el);

                // execute inline scripts
                $.buildFragment([responseText], document, scripts);
                if (scripts.length) {
                    $.each(scripts, function() {
                        $.globalEval( this.text || this.textContent || this.innerHTML || "" );
                    });
                }

                // This may be a complex form.
                if ($.fn.ploneTabInit) {
                    el.ploneTabInit();
                }
                pb.fi_focus(ajax_parent);

                pb.add_ajax_load(myform);
                // attach submit handler with the same options
                myform.ajaxForm(options);

                // attach close to element id'd by closeselector
                if (closeselector) {
                    el.find(closeselector).click(function (event) {
                        api.close();
                        return false;
                    });
                }
                $(document).trigger('formOverlayLoadSuccess', [this, myform, api, pb, ajax_parent]);
            } else {
                // there's no form in our new content or there's been an error
                if (success) {
                    if (typeof(noform) === "function") {
                        // get action from callback
                        noform = noform(el, pbo);
                    }
                } else {
                    noform = statusText;
                }

                switch (noform) {
                    case 'close':
                        api.close();
                        break;
                    case 'reload':
                        // 101692 when saving dialog within portal_registry
                        // api points to form div instead of the overlay api
                        api.close ? api.close() : form.closest('.overlay-ajax').overlay().close();
                        pb.spinner.show();
                        // location.reload results in a repost
                        // dialog in some browsers; very unlikely to
                        // be what we want.
                        location.replace(location.href);
                        break;
                    case 'redirect':
                        api.close();
                        pb.spinner.show();
                        target = pbo.redirect;
                        if (typeof(target) === "function") {
                            // get target from callback
                            target = target(el, responseText, pbo);
                        }
                        location.replace(target);
                        break;
                    default:
                        // 101692 when saving a rule edit reload the manage-rules
                        // page
                        if (success) {
                            api.close();
                            pb.spinner.show();
                            location.reload();
                            break;
                        }
                        if (el.children()) {
                            // show what we've got
                            ajax_parent.empty().append(el);
                        } else {
                            api.close();
                        }
                        break;
                }
                $(document).trigger('formOverlayLoadFailure', [this, myform, api, pb, ajax_parent, noform]);
            }
            pb.spinner.hide();
        };
        // error and success callbacks are the same
        options.error = options.success;

        pb.add_ajax_load(form);
        form.ajaxForm(options);
    };


    /******
     pb.ajax_click
     Click handler for ajax sources. The job of this routine
     is to do the ajax load of the overlay element, then
     call the JQT overlay loader.
     ******/
    pb.ajax_click = function (event) {
        var ethis = $(this),
            pbo,
            content,
            api,
            src,
            el,
            selector,
            formtarget,
            closeselector,
            sep,
            scripts = [];

        e = $.Event();
        e.type = "beforeAjaxClickHandled";
        $(document).trigger(e, [this, event]);
        if (e.isDefaultPrevented()) { return false; }
        pbo = jQuery(ethis).data('pbo');

        content = pb.create_content_div(pbo, ethis);
        // pbo.config.top = $(window).height() * 0.1 - ethis.offsetParent().offset().top;
        content.overlay(pbo.config, ethis);
        api = content.overlay();
        src = pbo.src;
        selector = pbo.selector;
        formtarget = pbo.formselector;
        closeselector = pbo.closeselector;

        pb.spinner.show();

        // prevent double click warning for this form
        $(this).find("input.submitting").removeClass('submitting');

        el = $('div.pb-ajax', content);
        if (el.length === 0) {
            el = $('<div class="pb-ajax" />');
            content.append(el);
        }
        if (api.getConf().fixed) {
            // don't let it be over 75% of the viewport's height
            el.css('max-height', Math.floor($(window).height() * 0.75));
        }

        // affix a random query argument to prevent
        // loading from browser cache
        sep = (src.indexOf('?') >= 0) ? '&': '?';
        src += sep + "ajax_load=" + (new Date().getTime());

        // add selector, if any
        if (selector) {
            src += ' ' + selector;
        }

        // set up callback to be used whenever new contents are loaded
        // into the overlay, to prepare links and forms to stay within
        // the overlay
        el[0].handle_load_inside_overlay = function(responseText, errorText) {
            var el = $(this);

            if (errorText === 'error') {
                el.append(pb.ajax_error_recover(responseText, selector));
            } else if (!responseText.length) {
                el.append(ajax_noresponse_message || 'No response from server.');
            }

            // a non-semantic div here will make sure we can
            // do enough formatting.
            el.wrapInner('<div />');

            // add the submit handler if we've a formtarget
            if (formtarget) {
                var target = el.find(formtarget);
                if (target.length > 0) {
                    pb.prep_ajax_form(target);
                }
            }

            // if a closeselector has been specified, tie it to the overlay's
            // close method via closure
            if (closeselector) {
                el.find(closeselector).click(function (event) {
                    api.close();
                    return false;
                });
            }

            // execute inline scripts
            $.buildFragment([responseText], document, scripts);
            if (scripts.length) {
                $.each(scripts, function() {
                    $.globalEval( this.text || this.textContent || this.innerHTML || "" );
                });
            }

            // This may be a complex form.
            if ($.fn.ploneTabInit) {
                el.ploneTabInit();
            }

            // remove element on close so that it doesn't congest the DOM
            api.onClose = function () {
                content.remove();
            };
            $(document).trigger('loadInsideOverlay', [this, responseText, errorText, api]);
        };

        // and load the div
        el.load(src, null, function (responseText, errorText) {
            // post-process the overlay contents
            el[0].handle_load_inside_overlay.apply(this, [responseText, errorText]);

            // Now, it's all ready to display; hide the
            // spinner and call JQT overlay load.
            pb.spinner.hide();
            api.load();

            return true;
        });

        // don't do the default action
        return false;
    };


    /******
     pb.iframe
     onBeforeLoad handler for iframe overlays.

     Note that the spinner is handled a little differently
     so that we can keep it displayed while the iframe's
     content is loading.
     ******/
    pb.iframe = function () {
        var content, pbo;

        pb.spinner.show();

        content = this.getOverlay();
        pbo = jQuery(this.getTrigger()).data('pbo');

        if (content.find('iframe').length === 0 && pbo.src) {
            content.append(
                '<iframe src="' + pbo.src + '" width="' +
                content.width() + '" height="' + content.height() +
                '" onload="pb.spinner.hide()"/>');
        } else {
            pb.spinner.hide();
        }
        return true;
    };

    // $('.newsImageContainer a')
    //     .prepOverlay({
    //          subtype: 'image',
    //          urlmatch: '/image_view_fullscreen$',
    //          urlreplace: '_preview'
    //         });

});

