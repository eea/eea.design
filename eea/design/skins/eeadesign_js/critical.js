var body = document.getElementsByTagName("body")[0];
var enable_nav_blend = body.className.indexOf("mini-header-navigation") !== -1;
var portal_column_two_wrapper = document.getElementById(
  "portal-column-two-wrapper"
);
var content_core = document.getElementById("content-core");
window.enlarge_content_area = function() {
  if (!enable_nav_blend) {
    return;
  }
  var window_width = window.innerWidth;
  if (window_width < 1280) {
    return;
  }
  var portal_column_two_height = portal_column_two_wrapper.clientHeight;
  if (portal_column_two_height > content_core.clientHeight) {
    content_core.style.height = portal_column_two_height + "px";
  }
};
window.enlarge_content_area();
