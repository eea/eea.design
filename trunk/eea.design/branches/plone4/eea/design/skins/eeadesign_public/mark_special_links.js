/* Scan all links in the document and set classes on them if
 * mark external links is turned on and
 * they point outside the site, or are special protocols.
 * Also implements new window opening for external links.
 * To disable this effect for links on a one-by-one-basis,
 * give them a class of 'link-plain'
 */

/* Scan all links in the document and set classes on them if
 * they point outside the site, or are special protocols
 * To disable this effect for links on a one-by-one-basis,
 * give them a class of 'link-plain'
 */


// http://domain/LL/....
langregex1 = new RegExp("(http://[a-z|0-9|.|:]*)/(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)/.*");
// http://domain/LL
langregex2 = new RegExp("(http://[a-z|0-9|.|:]*/)(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)$");
// http://domain/../LL
langregex3 = new RegExp("(http://[a-z|0-9|.|:]*/).*/(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)$");

// http://subdomain.LL.eea.europa.eu/..
subdomainregex = new RegExp("http://.*\\.(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu).eea.europa.eu/.*");


function getLanguageFromLink(link) {
    var L = link.toLowerCase();
    if (L.indexOf('://')>0 && 
        (L.indexOf(window.location.host)>0 || 
            L.indexOf('eu.int')>0 || 
            L.indexOf('europa.eu')>0)){
        // we assume it's english for local and known domains

        if (L.match(langregex1)){
            return langregex1.exec(L)[2];
        } 
        else if (L.match(langregex2)){
            return langregex2.exec(L)[2];
        } 
        else if (L.match(langregex3)){
            return langregex3.exec(L)[2];
        } 
        else if (L.match(subdomainregex)){
            return subdomainregex.exec(L)[1];
        } 

        return 'en';
    }
    return 'unknown';
}

function addLanguageLink(link, lang) {
    var wrapper = document.createElement("span");
    var oldLink = link.parentNode.replaceChild(wrapper,link);
    var langLink = oldLink.cloneNode(true);
    langLink.innerHTML = lang;
    langLink.className = "translated";
    var langwrapper = document.createElement("span");
    langwrapper.className = "languageCodes";
    langwrapper.appendChild(langLink);
    wrapper.appendChild(oldLink);
    wrapper.appendChild(langwrapper);
}


/*    var links = jq("a", contentarea).
                    not('.link-plain').
                    not('.noTranslation').
                    not('translated').
                    not('feedButton').
                    not('breadcrumbitem').
                    not(jq("#editbar > a").get());*/

function scanforlinks() {
    // first make external links open in a new window, afterwards do the
    // normal plone link wrapping in only the content area

    if (typeof external_links_open_new_window == 'string')
        var elonw = external_links_open_new_window.toLowerCase() == 'true';
    else elonw = false;

    if (typeof mark_special_links == 'string')
        var mslinks = mark_special_links.toLowerCase() == 'true';
    else mslinks = false;

    var url = window.location.protocol + '//' + window.location.host;

    if (elonw)
        // all http links (without the link-plain class), not within this site
        jQuery('a[href^=http]:not(.link-plain):not([href^=' + url + '])')
            .attr('target', '_blank');

    var contentarea = jQuery(getContentArea());

    if (mslinks) {
      var protocols = /^(mailto|ftp|news|irc|h323|sip|callto|https|feed|webcal)/;

      // All links with an http href (without the link-plain class), not within this site,
      // and no img children should be wrapped in a link-external span
      contentarea.find(
          'a[href^=http]:not(.link-plain):not([href^=' + url + ']):not(:has(img))')
          .wrap('<span></span>').parent().addClass('link-external')
      // All links without an http href (without the link-plain class), not within this site,
      // and no img children should be wrapped in a link-[protocol] span
      contentarea.find(
          'a[href]:not([href^=http]):not(.link-plain):not([href^=' + url + ']):not(:has(img))')
          .each(function() {
              // those without a http link may have another interesting protocol
              // wrap these in a link-[protocol] span
              if (res = protocols.exec(this.href))
                  jQuery(this).wrap('<span></span>').parent().addClass('link-' + res[0]);
          });
    }

    currentLanguage = getLanguageFromLink(location.href);

    // All links that are not relative and have no images
    contentarea.find("a[href^=http]:not(:has(img))").each(function(){
        var link = this;
        var linkval = jq(this).attr('href').toLowerCase();

        lang = getLanguageFromLink(linkval);
        if (lang !== currentLanguage && lang !== 'unknown'){
            addLanguageLink(link, lang);
        }
    });

};
jQuery(scanforlinks);

