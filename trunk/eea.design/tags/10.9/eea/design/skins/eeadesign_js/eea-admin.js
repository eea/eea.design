jQuery(function($) {
    // #17037 hide right column and have portal-column be full screen on history
    // and versioning diff pages
    var current_url = window.location.href;
    if ( current_url.indexOf('versions_history_form') !== -1 ||
         current_url.indexOf('version_diff') !== -1 ||
         current_url.indexOf('@@history') !== -1 ) {
        $("#portal-column-content").attr('class', 'cell width-full position-0');
        $("#portal-column-two").hide();
    }
});

if (typeof(eea) === 'undefined') {
    var eea = {};
}

(function($){
eea.LockHandler = {
    init: function() {
        // set up the handler, if there are any forms
        if ($('form.enableUnlockProtection').length) {
            eea.LockHandler.lock();
        }
    },

    lock: function(){
        if (this.submitting) {return;}
        $.ajax({url: eea.LockHandler._baseUrl() + '/@@plone_lock_operations/create_lock', async: false});
    },

    _baseUrl: function() {
        var baseUrl, pieces;

        baseUrl = $('base').attr('href');
        if (!baseUrl) {
            pieces = window.location.href.split('/');
            pieces.pop();
            baseUrl = pieces.join('/');
        }
        return baseUrl;
    }
};

$(eea.LockHandler.init);

})(jQuery);
