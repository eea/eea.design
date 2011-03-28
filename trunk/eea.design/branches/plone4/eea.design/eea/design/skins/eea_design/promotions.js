// Handle onload
jQuery(document).ready(function() {
    // Don't run on frontpage... In frontpage.css we make the promotions visible.
    if ($('body.frontpage').length > 0) {
        $('#top-news-area .portlet-promotions .promo-nav-portlet dd').removeClass('hide-promo');
    }
    else {
        setPromo();
    }
});

// Main function
var btn_ready = true;

function setPromo() {
    // Default settings
    var animation_speed = 800;

    // Set focus on random promo
    var promo_portlets = jQuery('.promo-nav-portlet');
    jQuery.each(promo_portlets, function() {
        var promos = jQuery('dd', this);
        if (promos.length > 0) {
            var sel_promo_id = promos[getRandom(promos.length)].id;
            showImage(sel_promo_id);
            jQuery("#" + sel_promo_id).toggle(animation_speed);
            jQuery('#' + sel_promo_id).addClass('active-promo');
            jQuery('#' + sel_promo_id).removeClass('hide-promo');
            updateCounter(this.id);
        }
    });

    // Set next/prev events
    jQuery(".promo-next").click(function () { promoMoveSlide(this, 'next', animation_speed) });
    jQuery(".promo-prev").click(function () { promoMoveSlide(this, 'prev', animation_speed) });

    // Set double tab events
    jQuery("span.portletTabHead").click(function () { rssBehavior(this) });
    jQuery("span.portletTabHead_current").click(function () { rssBehavior(this) });
}

// Related API
function getPortletId(context) { return context.id.substring(5, context.id.length) + '-portlet' }
function getRandom(range) { return Math.floor(Math.random()*range) }
function showImage(promo_id) {
    var image_ob = jQuery('#' + promo_id + ' IMG')[0];
    var image_src = jQuery('#' + promo_id + ' A')[2].href;
    jQuery('#' + promo_id + ' IMG')[0].src = image_src;
}
function updateCounter(portlet_id) {
    var sel_index = jQuery('#' + portlet_id + ' DD').index(jQuery('#' + portlet_id + ' DD.active-promo')[0]) + 1;
    var max_items = jQuery('#' + portlet_id + ' DD').length;
    jQuery("#count-" + portlet_id).html(sel_index + '/' +max_items);
}
function promoMoveSlide(context, direction, speed) {
    if (btn_ready == true) {
        var portlet_id = getPortletId(context);
        var sel_promo = jQuery('#' + portlet_id + ' .active-promo');

        if (direction == 'next') { var next_promo = sel_promo.next(); }
        else { var next_promo = sel_promo.prev(); }

        if (next_promo.length > 0 && next_promo[0].tagName == 'DD') {
            var sel_promo_id = sel_promo[0].id;
            var next_promo_id = next_promo[0].id;

            showImage(next_promo_id);
            jQuery("#" + sel_promo_id).slideToggle(speed);
            jQuery("#" + next_promo_id).slideToggle(speed);

            jQuery("#" + sel_promo_id).removeClass('active-promo');
            jQuery("#" + sel_promo_id).addClass('hide-promo');
            jQuery("#" + next_promo_id).removeClass('hide-promo');
            jQuery("#" + next_promo_id).addClass('active-promo');
        }

        updateCounter(portlet_id);
    }
}

// RSS feeds related
function rssBehavior(element) {
  var tabs = element.parentNode.getElementsByTagName('span');
  var feeds = new Array();
  var current_feed = document.getElementById('container-rss-'+element.id);

  // Get feeds
  for (var i=0; i<tabs.length; i++) {
    feeds[i] = document.getElementById('container-rss-'+tabs[i].id);}

  // Set tabs
  for (var i=0; i<tabs.length; i++) {
    tabs[i].className = 'portletTabHead';}
  element.className = 'portletTabHead_current';

  // Set feeds
  for (var i=0; i<feeds.length; i++) {
    feeds[i].style.display = 'none'; }
  current_feed.style.display = 'block';

  return false;}
