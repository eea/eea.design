jQuery(document).ready(function($) {
    'use strict';
//    #20302; save state on submit attempt and remove it on success
    var url_path_name = $("base").attr('href');
    var search_path = window.location.search;
    var saved_search_path = search_path.indexOf("Changes%20saved");
    var referrer = document.referrer;
    window.EEA = window.EEA || {};
    window.EEA.storage_utils = {};
    var storage_utils = window.EEA.storage_utils;
    var local_storage = window.localStorage;

    storage_utils.getLocalStorageEntry = function(key) {
        return local_storage.getItem(key);
    };

    storage_utils.delLocalStorageEntry = function(key) {
        return local_storage.removeItem(key);
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
                if (edit_form && edit_form_data) {
                    (function(){
                        var saved_form_objs = JSON.parse(edit_form_data);
                        var current_form_objs = edit_form.serializeArray();
                        var same_values = true;
                        var saved_form_objs_length = saved_form_objs.length;
                        var current_form_objs_length = current_form_objs.length;
                        var i, length, saved_form_obj, current_form_obj, saved_form_obj_name;
                        // saved form contains one extra entry which is the saved date
                        // therefore if there are more that one extra items saved
                        // as appose to the number of items currently in the form than
                        // we can continue with the restore dialog procedure
                        if (saved_form_objs_length - current_form_objs_length > 1) {
                            length = 0;
                            same_values = false;
                        }
                        else {
                            length = saved_form_objs_length;
                        }
                        for (i = 0; i < length; i++) {
                            saved_form_obj = saved_form_objs[i];
                            current_form_obj = current_form_objs[i];
                            saved_form_obj_name = saved_form_obj.name;
                            // we skip location entry check since the keys are not ordered in the same plus
                            // the saved entries are escaped
                            if (saved_form_obj_name === "location" || saved_form_obj_name === "last_referer"
                                || saved_form_obj_name === "saveDate")    {
                                continue;
                            }
                            if (saved_form_obj.value !== current_form_obj.value) {
                               same_values = false;
                                break;
                            }
                        }
                        if (same_values) {
                            return;
                        }
                        $.get('/www/restore_form_values')
                            .done(function( data ) {
                                var portlet_restore = $(data);
                                portlet_restore.dialog({
                                    open: function(event) {
                                        var entries = storage_utils.getLocalStorageEntry(url_path_name);
                                        var entry, value;
                                        if (entries) {
                                           entries = JSON.parse(entries);
                                           entry = entries[entries.length -1];
                                           if (entry.name === "saveDate") {
                                               value = entry.value;
                                               $(event.target).find('#js-restore-save-timestamp')
                                                              .html("(" + value.substring(0, value.length - 16) + ")");
                                           }
                                        }
                                    },
                                    buttons: {
                                        'Restore & Resubmit': function() {
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
                                            edit_form.data("rememberState", {"objName": url_path_name, "$el": edit_form, "onRestoreCallback": restoreCallback, "onSelectTagCallback": selectCallback });
                                            edit_form.rememberState('restoreState');

                                            $(this).dialog('close');
                                            edit_form.submit();
                                        },
                                        'No & Remove data': function() {
                                            $(this).dialog('close');
                                            storage_utils.delLocalStorageEntry(url_path_name);
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
    if (saved_search_path !== -1) {
        if (referrer.indexOf('portal_factory') !== -1) {
            (function() {
               var edit_ref = referrer.substring(0, referrer.length - 5);
               var atct_edit_ref = referrer.substring(0, referrer.length - 10);
                storage_utils.delLocalStorageEntry(edit_ref);
                storage_utils.delLocalStorageEntry(atct_edit_ref);
            }());
        }
        else {
            storage_utils.delLocalStorageEntry(url_path_name);
        }
    }
});
