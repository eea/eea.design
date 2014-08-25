jQuery(document).ready(function($) {
    'use strict';
//    #20302; save state on submit attempt and remove it on success
    var url_path_name = window.location.pathname;
    var search_path = window.location.search;
    var saved_search_path = search_path.indexOf("Changes%20saved");
    var error_search_path = search_path.indexOf('errored=True');
    window.EEA = window.EEA || {};
    window.EEA.storage_utils = {};
    var storage_utils = window.EEA.storage_utils;
    storage_utils.getLocalStorageKey = function(name) {
        return window.localStorage.key(name);
    };

    storage_utils.getLocalStorageEntry = function(key) {
        var storage_key = storage_utils.getLocalStorageKey(key);
//        if (storage_key  !== key) {
//            return null;
//        }
        return storage_key ? window.localStorage.getItem(storage_key) : null;
    };

    storage_utils.delLocalStorageEntry = function(key) {
        var storage_key = storage_utils.getLocalStorageKey(key);
//        if (storage_key  !== key) {
//            return null;
//        }
        return storage_key ? window.localStorage.removeItem(storage_key) : null;
    };

    storage_utils.getLocalStorageEntryValue = function(storage, value) {
        var values = JSON.parse(storage);
        var match, current, i, length;
        for (i = 0, length = values.length; i < length; i += 1) {
            current = values[i];
            if (current.name === value) {
                match = current.value;
                break;
            }
        }
        return match;
    };

    var edit_form = $("form[name='edit_form']");
    var edit_form_found = edit_form.length;
    if (edit_form_found) {
        (function() {
            var options = {
                objName: url_path_name,
                clearOnSubmit: false,
                onSaveCallback: function(values) {
                    values.push({
                        name: 'saveDate',
                        value: new Date().toString()
                    });
                    return values;
                }
            };
            edit_form.submit(function(){
                var $this = $(this);
                if ($this.rememberState) {
                    $this.rememberState(options);
                }
            });

            var edit_form_data = storage_utils.getLocalStorageEntry(url_path_name);
            if (edit_form_data) {
                if (error_search_path !== -1 && edit_form_found || edit_form && edit_form_data) {
                    (function(){
                        $.get('/www/restore_form_values')
                            .done(function( data ) {
                                var portlet_restore = $(data);
                                portlet_restore.dialog({
                                    buttons: {
                                        'Yes': function() {
                                            var $tmpl = $("<li class='token-input-token-facebook'><p></p>" +
                                                         "<span class='token-input-delete-token-facebook'>×</span></li>");
                                            var cleaned_select = false;
                                            var cleaned_themes = false;
                                            var $themes_options = $("#themes_options");
                                            var $themes_buttons = $('.context');
                                            var $themes_insert_btn = $themes_buttons.filter(function(idx, el) { return el.value === ">>"});
                                            var $themes_remove_btn = $themes_buttons.filter(function(idx, el) { return el.value === "<<"});
                                            var restoreCallback = function($el, data){
                                                var name = $el.attr('name');
                                                if (name === "subject_keywords:lines" || name === "temporalCoverage:lines") {
                                                    (function(){
                                                        $el.tokenInput("clear");
                                                        var data_value = data['value'];
                                                        var values = data_value.split('\r');
                                                        var i, length, value;

                                                        for (i = 0, length = values.length; i < length; i+= 1) {
                                                            value = values[i].trim();
                                                            $el.tokenInput("add", {name: value, id: value});
                                                        }
                                                    }());
                                                }
                                            };
                                            var selectCallback = function($el, data){
                                                var name = $el.attr('name');
                                                var value = data.value;
                                                if (name === "relatedItems:list") {
                                                    if (!cleaned_select) {
                                                         cleaned_select = true;
                                                         $el.empty();
                                                    }
                                                    $("<option>", {value: value, selected: true}).text(value).appendTo($el);
                                                }

                                                if (name === "themes:list") {
                                                    if (!cleaned_themes) {
                                                        cleaned_themes = true;
                                                        $themes_remove_btn.click();
                                                    }
                                                    $themes_options.find("[value='" + value + "']").attr('selected', true);
                                                    $themes_insert_btn.click();
                                                }
                                            };
                                            var obj_name = storage_utils.getLocalStorageKey(url_path_name) || url_path_name;
                                            edit_form.data("rememberState", {"objName": obj_name, "$el": edit_form, "onRestoreCallback": restoreCallback, "onSelectTagCallback": selectCallback });
                                            edit_form.rememberState('restoreState');

                                            $(this).dialog('close');
                                        },
                                        'No': function() {
                                            $(this).dialog('close');
                                            storage_utils.delLocalStorageEntry(url_path_name + '/edit');
                                        }
                                    }
                                });
                            });
                    }());
                }
            }
        }());
    }

    // remove form state on successful form submission
    if (saved_search_path) {
        storage_utils.delLocalStorageEntry(url_path_name + '/edit');
    }
});
