jQuery(function ($) {
  // #17037 hide right column and have portal-column be full screen on history
  // and versioning diff pages
  var current_url = window.location.href;
  if (
    current_url.indexOf("versions_history_form") !== -1 ||
    current_url.indexOf("version_diff") !== -1 ||
    current_url.indexOf("@@history") !== -1
  ) {
    $("#portal-column-content").attr("class", "cell width-full position-0");
    $("#portal-column-two").hide();
  }
});

if (window.EEA === undefined) {
  var EEA = {};
}

(function ($) {
  var baseUrl = (function () {
    var baseUrl, pieces;

    baseUrl = $("body").data("base-url");
    if (!baseUrl) {
      pieces = window.location.href.split("/");
      pieces.pop();
      baseUrl = pieces.join("/");
    }
    return baseUrl;
  })();
  EEA.LockHandler = {
    init: function () {
      // set up the handler, if there are any forms
      if ($("form.enableUnlockProtection").length) {
        EEA.LockHandler.lock();
      }
    },

    lock: function () {
      if (this.submitting) {
        return;
      }
      $.ajax({
        url: baseUrl + "/@@plone_lock_operations/create_lock",
        async: false,
      });
    },
  };

  $(EEA.LockHandler.init);

  EEA.RememberState = {
    local_storage: window.localStorage,

    getLocalStorageEntry: function (key) {
      return this.local_storage.getItem(key);
    },

    setLocalStorageEntry: function (key, value) {
      return this.local_storage.setItem(key, value);
    },

    delLocalStorageEntry: function (key) {
      return this.local_storage.removeItem(key);
    },

    cleanup: function () {
      var search_path = window.location.search;
      var saved_search_path = search_path.indexOf("Changes%20saved");
      var referrer = document.referrer;

      // remove form state on successful form submission
      if (saved_search_path !== -1) {
        if (referrer.length && referrer.indexOf("portal_factory") === -1) {
          (function () {
            var edit_ref = referrer.substring(0, referrer.length - 5);
            var atct_edit_ref = referrer.substring(0, referrer.length - 10);
            EEA.RememberState.delLocalStorageEntry(edit_ref);
            EEA.RememberState.delLocalStorageEntry(atct_edit_ref);
          })();
        } else {
          EEA.RememberState.delLocalStorageEntry(baseUrl);
        }
      }
    },
  };

  $(EEA.RememberState.cleanup);
})(jQuery);
