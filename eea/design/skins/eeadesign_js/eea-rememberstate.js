"use strict";
/*global jQuery  */
/* EXTERNAL DEPENDENCIES:
 * - jquery-ui.js dialog,
 * - ++resource++jquery.remember-state.js
 * - ++resource++jquery.tokeninput.js - for subject and temporalField
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
      // "location",
      "id",
      "last_referer",
      "image_delete",
      // "saveDate",
      "cmfeditions_version_comment",
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
      // if (edit_form.rememberState) {
      //   edit_form.rememberState(options);
      // }
      var filtered_form_values = cleanup_form(edit_form);
      filtered_form_values.push({
        name: "saveDate",
        value: new Date().toString(),
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

      for (i = 0; i < length; i++) {
        saved_form_obj = saved_form_objs[i];
        current_form_obj = current_form_objs[i];
        saved_form_obj_name = saved_form_obj.name;
        // we skip location entry check since the keys are not ordered in the
        // same plus the saved entries are escaped
        if (skip_field_names.indexOf(saved_form_obj_name) !== -1) {
          continue;
        }
        if (saved_form_obj.value !== current_form_obj.value) {
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
          var data = JSON.parse(localStorage.getItem(opts.objName)),
            $f = opts.$el,
            $e,
            val,
            name,
            previous_el,
            $select_option;
          for (var i in data) {
            name = data[i].name;
            val = data[i].value;
            $e = $f.find('[name="' + name + '"]');
            if ($e.is(":radio")) {
              $e.filter('[value="' + name + '"]').prop("checked", true);
            } else if ($e.is(":checkbox")) {
              $e.prop("checked", val === "on");
            } else if ($e.is(":hidden") && name.indexOf(":default") !== -1) {
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
              // }
              // if (opts.onSelectTagCallback) {
              //   opts.onSelectTagCallback($e, data[i]);
              // }
            } else {
              $e.val(val);
            }
            $e && opts.onRestoreCallback && opts.onRestoreCallback($e, data[i]);
            $e.change();
          }
        };

        var portlet_restore = $(data);
        portlet_restore.dialog({
          open: function (event) {
            var entries = storage_utils.getLocalStorageEntry(url_path_name);
            var entry, value, save_date, modified_date;
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
                save_date = new Date(value);
                modified_date = new Date(
                  $("#js-restore-object-modification-timestamp").text()
                );
                // if (save_date - modified_date < 0) {
                //   $(this).dialog("close");
                // }
              }
            }
          },
          buttons: {
            "Restore & Resubmit": function () {
              var cleaned_select;
              // var $themes_options = $("#themes_options");
              // var $themes_buttons = $("#archetypes-fieldname-themes").find(
              //   ".context"
              // );
              // var $themes_insert_btn = $themes_buttons.eq(0);
              // var $themes_remove_btn = $themes_buttons.eq(1);
              var restoreCallback = function ($el, data) {
                var name = $el.attr("name");
                if (
                  name === "subject_keywords:lines" ||
                  name === "temporalCoverage:lines"
                ) {
                  (function () {
                    $el.tokenInput("clear");
                    var data_value = data.value;
                    var values = data_value.split("\r");
                    var i, length, value;

                    for (i = 0, length = values.length; i < length; i += 1) {
                      value = values[i].trim();
                      $el.tokenInput("add", { name: value, id: value });
                    }
                  })();
                }
              };
              var selectCallback = function ($el, data) {
                var name = $el.attr("name");
                var value = data.value;
                if (name === "relatedItems:list") {
                  if (!cleaned_select) {
                    cleaned_select = true;
                    $el.empty();
                  }
                  $("<option>", { value: value, selected: true })
                    .text(value)
                    .appendTo($el);
                } else if (name.indexOf(":list") !== -1) {
                  (function () {
                    var $options = $el;
                    var $buttons = $el.parent().prev().find(".context");
                    var $insert_btn = $buttons.eq(0);
                    var $remove_btn = $buttons.eq(1);
                    if (!$el.data("cleaned")) {
                      $el.data("cleaned", true);
                      $remove_btn.click();
                    }
                    $options
                      .find("[value='" + value + "']")
                      .prop("selected", true);
                    $insert_btn.click();
                  })();
                }
              };
              restoreState({
                objName: url_path_name,
                $el: edit_form,
                onRestoreCallback: restoreCallback,
                onSelectTagCallback: selectCallback,
              });

              $(this).dialog("close");
              edit_form.submit();
            },
            "No & Remove data": function () {
              $(this).dialog("close");
              storage_utils.delLocalStorageEntry(url_path_name);
            },
          },
        });
      });
    })();
  })();
});

// var edit_form_data = storage_utils.getLocalStorageEntry(url_path_name);
// var portlet_restore = $("#js-portletRestoreForm");
// if (edit_form_data) {
//     portlet_restore.find('.portletRestoreForm-entry').html(storage_utils.getLocalStorageEntryValue(edit_form_data, 'saveDate'))
//         .end().removeClass('visualHidden');
// }
