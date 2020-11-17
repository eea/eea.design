var body = document.getElementsByTagName("body")[0];
var portal_column_two_wrapper = document.getElementById(
  "portal-column-two-wrapper"
);

var enable_nav_blend = body.className.indexOf("mini-header-navigation") !== -1 && portal_column_two_wrapper;
var content_core = document.getElementById("content-core");
var qs = document.querySelector.bind(document);


// 120363 add breadcrumbs trail from right column nav to mobile nav
var make_nav_blend = function() {
  if (!enable_nav_blend) {
    return;
  }

  var portlet_nav = qs(".portletNavigationTree");
  var extra_nav_li = document.createElement('li');
  var level = 1;
  var cloned_portlet_nav = portlet_nav.cloneNode(true);
  extra_nav_li.className = "mobile-only";
  extra_nav_li.appendChild(cloned_portlet_nav);
  var nav_header = cloned_portlet_nav.querySelector("#firstHeader");
  var submenu_headers = cloned_portlet_nav.querySelectorAll(".portletSubMenuHeader");
  if (submenu_headers.length < 2) {
    submenu_headers[0].style.display = "none";
    portlet_nav.querySelector(".portletSubMenuHeader").style.display = "none";
  }
  var nav_header_link = nav_header.querySelector("a");
  var nav_header_href = nav_header_link.href;
  var nav_header_list = document.createElement("li");

  var global_nav = qs("#portal-globalnav");
  var global_nav_root_link = Array.prototype.filter.call(global_nav.querySelectorAll("a"), function(item) {
    return nav_header_href.indexOf(item.href) !== -1;
  });
  var global_nav_root_li;
  if (!global_nav_root_link.length) {
    global_nav_root_li = document.createElement("li");
    global_nav_root_li.className = "mobile-only";
    global_nav_root_li.appendChild(nav_header_link);
    cloned_portlet_nav.removeChild(nav_header);
    global_nav.appendChild(global_nav_root_li);
    global_nav_root_li.insertAdjacentElement('afterend', extra_nav_li);
  } else {
    global_nav_root_link = global_nav_root_link[0];
    global_nav_root_li = global_nav_root_link.parentNode;
    global_nav_root_li.className = "";
    // level += 1;
    if (global_nav_root_link.href !== nav_header_href) {
      nav_header_list.className = "mobile-only";
      nav_header_link.className = "pl-" + level;
      nav_header_list.appendChild(nav_header_link);
      global_nav_root_li.insertAdjacentElement('afterend', nav_header_list);
      nav_header_list.insertAdjacentElement('afterend', extra_nav_li);
    }
    else {
      global_nav_root_li.insertAdjacentElement('afterend', extra_nav_li);
    }
    cloned_portlet_nav.removeChild(nav_header);
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
    content_core.style.minHeight = (portal_column_two_height  - 150) + "px";
  }
};
window.enlarge_content_area();
