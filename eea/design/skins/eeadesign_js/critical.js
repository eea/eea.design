var body = document.getElementsByTagName("body")[0];
var enable_nav_blend = body.className.indexOf("mini-header-navigation") !== -1;
var portal_column_two_wrapper = document.getElementById(
  "portal-column-two-wrapper"
);
var content_core = document.getElementById("content-core");
var qs = document.querySelector.bind(document);


// 120363 add breadcrumbs trail from right column nav to mobile nav
var make_nav_blend = function() {
  if (!enable_nav_blend) {
    return;
  }

  var portlet_nav = qs(".portletNavigationTree");
  var extra_nav_li = document.createElement('li');
  extra_nav_li.className = "mobile-only";
  var cloned_portlet_nav = portlet_nav.cloneNode(true);
  extra_nav_li.appendChild(cloned_portlet_nav);
  var values = new window.Map();
  var nav_header = portlet_nav.querySelector("#firstHeader").querySelector("a");
  var nav_header_text = nav_header.innerText;
  var nav_header_href = nav_header.href;
  var global_nav = qs("#portal-globalnav");
  var global_nav_root_link = Array.prototype.filter.call(global_nav.querySelectorAll("a"), function(item) {
    return nav_header_href.indexOf(item.href) !== -1;
  });
  var global_nav_root_li;
  // var $selected_nav_link = portlet_nav.querySelector(".navTreeCurrentItem");
  // var level = 0;
  // var insert_last = false;
  if (!global_nav_root_link.length) {
    // insert_last = true;
    values.set(nav_header_text, { href: nav_header.href });
  } else {
    global_nav_root_link = global_nav_root_link[0];
    global_nav_root_li = global_nav_root_link.parentNode;
    global_nav_root_li.className = "";
    level += 1;
    if (global_nav_root_link.href !== nav_header_href) {
      values.set(nav_header_text, { href: nav_header_href });
      global_nav_root_li.insertAdjacentElement('afterend', extra_nav_li);
    }
  }
};
make_nav_blend();

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
