/*
Inserts GA using DOM insertion of <script> tag and "script onload" method to
initialize the pageTracker object. Prevents GA insertion from blocking I/O!

As suggested in Steve Souder's talk. See:
http://google-code-updates.blogspot.com/2009/03/steve-souders-lifes-too-short-write.html
*/

// pageTracker must be global variable, since it is used by other scripts and inline pages
var pageTracker;

/* acct is GA account number, i.e. "UA-5555555-1" */
function gaSSDSLoad (acct) {
  var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www."),
      s;

  s = document.createElement('script');
  s.src = gaJsHost + 'google-analytics.com/ga.js';
  s.type = 'text/javascript';
  s.onloadDone = false;
  function init () {
    pageTracker = _gat._getTracker(acct);
    pageTracker._setDomainName("eea.europa.eu");
    pageTracker._initData();
    pageTracker._trackPageview();
  }
  s.onload = function () {
    s.onloadDone = true;
    init();
  };
  s.onreadystatechange = function() {
    if (('loaded' === s.readyState || 'complete' === s.readyState) && !s.onloadDone) {
      s.onloadDone = true;
      init();
    }
  };
  document.getElementsByTagName('head')[0].appendChild(s);
}

// IE6 crashes if we don't run the function after DOM is ready. Presumably
// this is because the 'head' element hasn't yet been closed.
function gaSSDSLoad_init() {
    gaSSDSLoad("UA-184389-1");
}
registerPloneFunction(gaSSDSLoad_init);
