/* This JS integrates jquery.galleryview with the EEA site. */
$(document).ready(function() {
    if ($.fn.galleryView !== undefined) {
        $('#galleryView').galleryView({
            panel_width: 768,
            panel_height: 511,
            frame_width: 50,
            frame_height: 50,
            transition_speed: 350,
            transition_interval: 0
        });
    }
});
