/* jslint:disable */

/*
* Count DNT-signals
* https://www.quantable.com/analytics/how-many-do-not-track/
*/
var DNT = 'no';
if (navigator.doNotTrack == "yes" || navigator.doNotTrack == "1" || navigator.msDoNotTrack == "1" || window.doNotTrack == "yes" || window.doNotTrack == "1" || window.msDoNotTrack == "1"){
 DNT = 'yes';
}

/* Matomo Analytics */
var _paq = _paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(["setDocumentTitle", document.domain + "/" + document.title]);
_paq.push(["setCookieDomain", "*.eea.europa.eu"]);
_paq.push(['setCustomDimension', 2, DNT]);
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  var u="https://matomo.eea.europa.eu/";
  var hn=window.location.host;
  var sids={"www.eea.europa.eu":"3",
            "semantic.eea.europa.eu":"34",
            "eunis.eea.europa.eu":"35",
            "community.eea.europa.eu":"36",
            "search.apps.eea.europa.eu":"37"};
  var d=document, sid=d.getElementsByTagName('html')[0].getAttribute('data-siteid') || sids[hn] || '3';
  _paq.push(['setTrackerUrl', u+'piwik.php']);
  _paq.push(['setSiteId', sid]);
  var g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
})();
