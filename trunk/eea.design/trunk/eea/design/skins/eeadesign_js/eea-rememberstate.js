jQuery(document).ready(function($) {
    'use strict';
//    #20302; save state on submit attempt and remove it on success
    var url_path_name = window.location.pathname;
    var saved_search_path = window.location.search.indexOf("Changes%20saved");
    window.EEA = window.EEA || {};
    window.EEA.storage_utils = {};
    var storage_utils = window.EEA.storage_utils;
    storage_utils.getLocalStorageEntry = function(key) {
        var storage_key = window.localStorage.key(key);
        if (storage_key  !== key) {
            return null;
        }
        return storage_key ? window.localStorage.getItem(storage_key) : null;
    };

    storage_utils.delLocalStorageEntry = function(key) {
        var storage_key = window.localStorage.key(key);
        if (storage_key  !== key) {
            return null;
        }
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
            var portlet_restore = $("#js-portletRestoreForm");
            if (edit_form_data) {
                portlet_restore.find('.portletRestoreForm-entry').html(storage_utils.getLocalStorageEntryValue(edit_form_data, 'saveDate'))
                    .end().removeClass('visualHidden');
            }
        }());
    }

    // remove form state on successful form submission
    if (saved_search_path) {
        storage_utils.delLocalStorageEntry(url_path_name);
    }
});
