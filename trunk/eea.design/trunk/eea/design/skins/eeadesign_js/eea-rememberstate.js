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
    storage_utils.getLocalStorageEntry = function(key) {
        var storage_key = window.localStorage.key(key);
//        if (storage_key  !== key) {
//            return null;
//        }
        return storage_key ? window.localStorage.getItem(storage_key) : null;
    };

    storage_utils.delLocalStorageEntry = function(key) {
        var storage_key = window.localStorage.key(key);
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
    if (edit_form) {
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
                if (error_search_path !== -1) {
                    (function(){
                        $.get('/restore_form_values')
                            .done(function( data ) {
                                var portlet_restore = $(data);
                                portlet_restore.dialog({
                                    buttons: {
                                        'Yes': function() {
                                            var $tmpl = $("<li class='token-input-token-facebook'><p></p>" +
                                                         "<span class='token-input-delete-token-facebook'>×</span></li>");
                                            var restoreCallback = function($el, data){
                                                var name = $el.attr('name');
                                                if (name === "subject_keywords:lines" || name === "temporalCoverage:lines") {
                                                    (function(){
                                                        var $ul = $el.prev();
                                                        $ul.empty();
                                                        var values = data['value'].split('\r');
                                                        var i, length, value;
                                                        for (i = 0, length = values.length; i < length; i+= 1) {
                                                            value = values[i].trim();
                                                            $tmpl.clone().find('p').text(value).end().appendTo($ul);
                                                        }
                                                    }());
                                                }
                                            };
                                            edit_form.data("rememberState", {"objName": url_path_name, "$el": edit_form, "onRestoreCallback": restoreCallback});
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
