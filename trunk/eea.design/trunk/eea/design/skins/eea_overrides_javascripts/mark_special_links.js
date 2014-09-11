/* Scan all links in the document and set classes on them if
 * they point outside the site, or are special protocols
 * To disable this effect for links on a one-by-one-basis,
 * give them a class of 'link-plain'
 */

function getLanguageFromLink(link) {
    if (link.toLowerCase().indexOf('://')>0 &&
        (link.toLowerCase().indexOf(window.location.host)>0 ||
                                    link.toLowerCase().indexOf('eu.int')>0 ||
                                    link.toLowerCase().indexOf('europa.eu')>0)){
        // we assume it's english for local and known domains

        if (link.toLowerCase().match(langregex1)){
            return langregex1.exec(link.toLowerCase())[2];
        }
        else if (link.toLowerCase().match(langregex2)){
            return langregex2.exec(link.toLowerCase())[2];
        }
        else if (link.toLowerCase().match(langregex3)){
            return langregex3.exec(link.toLowerCase())[2];
        }
        else if (link.toLowerCase().match(subdomainregex)){
            return subdomainregex.exec(link.toLowerCase())[1];
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
    langLink.removeAttribute('id'); // ids should be unique
    var langwrapper = document.createElement("span");
    langwrapper.className = "languageCodes";
    langwrapper.appendChild(langLink);
    wrapper.appendChild(oldLink);
    wrapper.appendChild(langwrapper);
}

function scanforlinksinarea(contentarea) {
    // terminate if we hit a non-compliant DOM implementation
    if (!W3CDOM) { return false; }

    // scan for links only in content area or the area supplied
    if (!contentarea) { return false; }

    links = contentarea.getElementsByTagName('a');
    currentLanguage = getLanguageFromLink(location.href);

    for (i=0; i < links.length; i++) {
        var parent = jQuery(links[i]).parent();
        if(parent.hasClass('actionMenuHeader')){
            continue;
        }
        if ( (links[i].getAttribute('href')) &&
            (links[i].className.indexOf('link-plain') === -1)    &&
            (links[i].className.indexOf('noTranslation') === -1) &&
            (links[i].className.indexOf('translated') === -1)    &&
            (links[i].className.indexOf('feedButton') === -1)    &&
            (links[i].className.indexOf('breadcrumbitem') === -1)) {
            var linkval = links[i].getAttribute('href');

            // ADD CSS CLASSES FOR FILE EXTENSIONS
            // grab file extension
            colonIdx = linkval.lastIndexOf(':');
            // add host name if relative links (for FireFox)
            relativeLink = 0;
            if (colonIdx < 0) {
                if (linkval.indexOf('/') > 0 || linkval.indexOf('/') === -1 ) {
                    linkval = 'http://'+window.location.host+'/'+linkval;
                    relativeLink = 1;
                } else {
                    linkval = 'http://'+window.location.host+linkval;
                }
            }

            //remove arguments to identify extension
            argIdx = linkval.indexOf('?');
            if (argIdx == -1) {
                argIdx = linkval.length;
            }
            var shortlinkval = linkval.substring(0, argIdx);

            ext_idx0 = shortlinkval.lastIndexOf('.');
            slashIdx = shortlinkval.lastIndexOf('/');
            colonIdx = shortlinkval.lastIndexOf(':');


            if(slashIdx > colonIdx+2 && slashIdx < ext_idx0) {
                extension = shortlinkval.substring(ext_idx0 + 1);
            // add class name = link-extension
            // it can be styled as you prefer in your css
               if (ext_idx0 > 0 &&
                links[i].getElementsByTagName('img').length === 0  ) {
                    wrapNode(links[i], 'span', 'link-'+extension.toLowerCase());
                }
            }
            // ADD CSS CLASSES FOR SPECIAL PROTOCOLS
            // check if the link href is a relative link, or an absolute link to
            // the current host.
            if (linkval.toLowerCase().indexOf('://')>0 &&
                (linkval.toLowerCase().indexOf(window.location.host)>0 ||
                                               linkval.toLowerCase().indexOf('eea.eu.int')>0 ||
                                               linkval.toLowerCase().indexOf('eea.europa.eu')>0)){
                // absolute link internal to our host
                var jslint_pleaser = 1; // pleases jslint
            } else if (linkval.indexOf('http:') !== 0) {
                // not a http-link. Possibly an internal relative link, but also
                // possibly a mailto or other protocol add tests for relevant
                // protocols as you like.
                protocols = ['mailto', 'ftp', 'news', 'irc', 'h323', 'sip',
                             'callto', 'https', 'feed', 'webcal'];
                // h323, sip and callto are internet telephony VoIP protocols
                for (p=0; p < protocols.length; p++) {
                    if (linkval.indexOf(protocols[p]+':') === 0) {
                        // if the link matches one of the listed protocols, add
                        // className = link-protocol
                        wrapNode(links[i], 'span', 'link-'+protocols[p]);
                        break;
                    }
                }
            } else {
                // we are in here if the link points to somewhere else than our site.
                if ( links[i].getElementsByTagName('img').length === 0 ) {
                    // we do not want to mess with those links that already have
                    // images in them
                    wrapNode(links[i], 'span', 'link-external');
                    // uncomment the next line if you want external links to be
                    // opened in a new window.
                    //links[i].setAttribute('target', '_blank');
                }
            }

            if (linkval.toLowerCase().indexOf('://')>0 && relativeLink === 0 && links[i].getElementsByTagName('img').length === 0){
                lang = getLanguageFromLink(linkval);
                if (lang !== currentLanguage && lang !== 'unknown'){
                    addLanguageLink(links[i], lang);
                }
            }
        }
    }
}

function scanforlinks() {
    contentarea = getContentArea();
    scanforlinksinarea(contentarea);
}

// http://domain/LL/....
langregex1 = new RegExp("(http://[a-z|0-9|.|:]*)/(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)/.*");
// http://domain/LL
langregex2 = new RegExp("(http://[a-z|0-9|.|:]*/)(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)$");
// http://domain/../LL
langregex3 = new RegExp("(http://[a-z|0-9|.|:]*/).*/(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu)$");

// http://subdomain.LL.eea.europa.eu/..
subdomainregex = new RegExp("http://.*\\.(aa|ab|af|am|ar|as|ay|az|ba|be|bg|bh|bi|bn|bo|bs|br|ca|ch|co|cs|cy|da|de|dz|el|en|eo|es|et|eu|fa|fi|fj|fo|fr|fy|ga|gd|gl|gn|gu|gv|ha|he|hi|hr|hu|hy|ia|id|ie|ik|is|it|iu|ja|jbo|jw|ka|kk|kl|km|kn|ko|ks|ku|kw|ky|la|lb|li|ln|lo|lt|lv|mg|mi|mk|ml|mn|mo|mr|ms|mt|my|na|ne|nl|no|nn|oc|om|or|pa|pl|ps|pt|qu|rm|rn|ro|ru|rw|sa|sd|se|sg|sh|si|sk|sl|sm|sn|so|sq|sr|ss|st|su|sv|sw|ta|te|tg|th|ti|tk|tl|tn|to|tr|ts|tt|tw|ug|uk|ur|uz|vi|vo|wa|wo|xh|yi|yo|za|zh|zu).eea.europa.eu/.*");

registerPloneFunction(scanforlinks);

