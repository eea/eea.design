"use strict";
/*global jQuery, document, window  */
/* EXTERNAL DEPENDENCIES:
 * - jquery-ui.js dialog,
 * BROWSER FEATURES: JSON, localStorage */

/*
 * Gives you the possibility to reapply the form data that you've attempted to
 * submit when you've received a 500 page error on page edit
 * */
jQuery(document).ready(function ($) {
  //    #20302; save state on submit attempt and remove it on success
  var url_path_name = jQuery("body").data("base-url") || "";
  window.EEA = window.EEA || {};
  var storage_utils = window.EEA.RememberState;
  if (!storage_utils) {
    return;
  }

  var edit_form = $("form[name='edit_form']");
  var edit_form_found = edit_form.length;
  if (!edit_form_found) {
    return;
  }
  (function () {
    var skip_field_names = [
      "id",
      "last_referer",
      "image_delete",
      "cmfeditions_version_comment"
    ];
    var cleanup_form = function (form) {
      var values = form.serializeArray();
      return values.filter(function (value) {
        return skip_field_names.indexOf(value.name) === -1;
      });
    };

    var save_btn = $(".context").filter("[name='form.button.save']");
    save_btn.click(function (e) {
      e.preventDefault();
      var filtered_form_values = cleanup_form(edit_form);
      filtered_form_values.push({
        name: "saveDate",
        value: new Date().toString()
      });
      storage_utils.setLocalStorageEntry(
        url_path_name,
        JSON.stringify(filtered_form_values)
      );
      edit_form.submit();
    });

    var edit_form_data = storage_utils.getLocalStorageEntry(url_path_name);
    if (!edit_form_data) {
      return;
    }
    (function () {
      if ($(".error").length || $("#davizvisualization-base-edit").length) {
        return;
      }
      var saved_form_objs = JSON.parse(edit_form_data);
      var current_form_objs = cleanup_form(edit_form);
      var same_values = true;
      // remove date object before checking length
      saved_form_objs.pop();
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
      } else {
        length = saved_form_objs_length;
      }
      function check_temporal_values(sval, cval) {
        var values = sval.split("-");
        var value = values[0] + "-" + values[values.length - 1];
        return value === cval;
      }

      for (i = 0; i < length; i++) {
        saved_form_obj = saved_form_objs[i];
        current_form_obj = current_form_objs[i];
        saved_form_obj_name = saved_form_obj.name;
        // skip checking fields that will not be the same within current form
        if (skip_field_names.indexOf(saved_form_obj_name) !== -1) {
          continue;
        }

        // handle temporal Coverage for cases where we have a transform
        // of values from 1990-2000 2001-2010 to 1990-2010 on current form
        if (saved_form_obj_name === "temporalCoverage:lines") {
          if (saved_form_obj.value !== current_form_obj.value) {
            same_values = check_temporal_values(
              saved_form_obj.value,
              current_form_obj.value
            );
            if (same_values) {
              continue;
            } else {
              same_values = false;
              break;
            }
          }
        }
        if (saved_form_obj.value !== current_form_obj.value) {
          // we skip location entry check since the keys are not ordered in the
          // same plus the saved entries are escaped
          if (saved_form_obj_name !== "location") {
            same_values = false;
            break;
          }
        }
      }
      if (same_values) {
        return;
      }
      $.get(url_path_name + "/restore_form_values").done(function (data) {
        var restoreState = function (opts) {
          var data = JSON.parse(window.localStorage.getItem(opts.objName)),
            $f = opts.$el,
            $e,
            entry,
            val,
            name,
            previous_el,
            $select_option;
          for (var i in data) {
            if (data.hasOwnProperty(i)) {
              entry = data[i];
              name = entry.name;
              val = entry.value;
              $e = $f.find('[name="' + name + '"]');
              if ($e.is(":radio")) {
                $e.filter('[value="' + val + '"]').prop("checked", true);
              } else if ($e.is(":checkbox")) {
                $e.prop("checked", val === "on");
              } else if ($e.is(":hidden") && name.indexOf(":default") !== -1) {
                // this code is needed for checkboxes that need to be disabled
                // in case there is a checkbox to enable than the previous data
                // entry will be the current name plus :default
                previous_el = data[i - 1];
                if (previous_el.name + ":default" !== name) {
                  $e.prev().prop("checked", false);
                }
              } else if ($e.is("select")) {
                if ($e.attr("name").indexOf(":") !== -1) {
                  if (!$e.data("cleaned")) {
                    $e.empty();
                    $e.data("cleaned", true);
                  }
                }
                $select_option = $e.find('[value="' + val + '"]');
                if ($select_option.length) {
                  $select_option.prop("selected", true);
                } else {
                  $("<option>", { value: val, selected: true })
                    .text(val)
                    .appendTo($e);
                }
              } else {
                $e.val(val);
              }
              $e.change();
            }
          }
        };

        var portlet_restore = $(data);
        portlet_restore.dialog({
          open: function (event) {
            var entries = storage_utils.getLocalStorageEntry(url_path_name);
            var entry, value;
            if (entries) {
              entries = JSON.parse(entries);
              entry = entries[entries.length - 1];
              if (entry.name === "saveDate") {
                value = new Date(entry.value);
                $(event.target)
                  .find("#js-restore-save-timestamp")
                  .html(
                    "(" +
                      value.toDateString() +
                      " " +
                      value.toLocaleTimeString() +
                      ")"
                  );
              }
            }
          },
          buttons: {
            "Restore & Resubmit": function () {
              restoreState({
                objName: url_path_name,
                $el: edit_form
              });

              $(this).dialog("close");
              edit_form.submit();
            },
            "No & Remove data": function () {
              $(this).dialog("close");
              storage_utils.delLocalStorageEntry(url_path_name);
            }
          }
        });
      });
    })();
  })();
});
