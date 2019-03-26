// IE9+ closest support

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
    var el = this;
    if (!document.documentElement.contains(el)) {
      return null;
    }
    do {
      if (el.matches(s)) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}

// CORS support https://www.html5rocks.com/en/tutorials/cors/
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

// EEA Custom Search
if (window.EEA === undefined) {
  var EEA = {
    who: "eea.design",
    feature: "Custom Search",
    version: 1.0
  };
}

EEA.CustomSearch = function (context) {
  var self = this;
  self.focus = null;
  self.context = context;
  self.form = self.context.closest("form");
  self.getting_tags = false;
  self.tags_url = self.context.getAttribute("data-tags-url");
  self.tags = [];
  self.template = {
    'query': {
      'function_score': {
        'query': {
          'bool': {
            'filter': {
              'bool': {
                'should': [{ 'term': { 'language': 'en' } }]
              }
            },
            'must': {
              'bool': {
                'must': [
                  {
                    'query_string': {
                      'query': ""
                    }
                  },

                  {
                   "constant_score":{
                      "filter":{
                         "bool":{
                            "should":[
                               {
                                "bool":{
                                   "must_not":{
                                      "exists":{
                                         "field":"expires"
                                        }
                                     }
                                  }
                               }
                            ]
                         }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  };
  self.initialize();
};

EEA.CustomSearch.prototype = {
  initialize: function () {
    var self = this;
    self.init_source();
    self.init_autocomplete();

    // Bind events

    // Click outside search input
    document.addEventListener("click", function (e) {
      self.close_all_lists(e);
    });

    self.autocomplete.addEventListener("mousemove", function(e) {
      self.add_active(e.target);
    });

    // Form submit
    self.form.addEventListener('submit', function (e) {
      self.on_submit(e);
    });

    // Input value changed
    self.context.addEventListener('change', function (e) {
      self.on_change(e);
    });

    // Click and type within search input
    self.context.addEventListener("input", function (e) {
      if(self.getting_tags){
        clearTimeout(self.getting_tags);
      }
      self.getting_tags = setTimeout(function(){
        self.on_input(e);
      }, 300);
    });

    // Key press events
    self.context.addEventListener("keydown", function (e) {
      self.on_keydown(e);
    });
  },

  init_source: function () {
    var self = this;
    self.source = document.createElement("input");
    self.source.name = "source";
    self.source.type = "hidden";
    self.context.parentNode.appendChild(self.source);
  },

  init_autocomplete: function () {
    var self = this;
    self.autocomplete = document.createElement("div");
    self.autocomplete.setAttribute("class", "autocomplete-items");
    self.context.parentNode.appendChild(self.autocomplete);
  },

  on_input: function (e) {
    var self = this;
    if (!self.tags_url) {
      return;
    }

    var url = self.tags_url + "?q=" + self.context.value;
    var xhr = createCORSRequest("GET", url);

    if (!xhr){
      // CORS not supported
      return;
    }

    xhr.onload = function() {
      self.tags = JSON.parse(this.responseText);
      self.on_tags_ready(self.context.value);
    };

    xhr.onerror = function() {
      return;
    };

    xhr.send();
  },

  on_tags_ready: function (e) {
    var self = this;
    var a, b, i;
    self.close_all_lists();
    if (!self.context.value) {
      return false;
    }

    var tag_on_click = function(e){
      self.context.value = e.target.getAttribute("data-tag");
      self.on_change(e);
      self.on_submit(e);
      self.close_all_lists();
      self.form.submit();
    };

    for (i = 0; i < self.tags.length; i++) {
      b = document.createElement("div");
      b.setAttribute("class", "autocomplete-item");
      b.innerHTML = "<strong>" + self.tags[i].substr(0, self.context.value.length) + "</strong>";
      b.innerHTML += self.tags[i].substr(self.context.value.length);
      b.setAttribute("data-tag", self.tags[i]);
      b.addEventListener("click", tag_on_click);
      self.autocomplete.appendChild(b);
    }
  },

  on_keydown: function (e) {
    var self = this;
    var i, x = self.autocomplete.getElementsByTagName("div");
    var found = 0;
    if (e.keyCode == 40) {  // down
      for (i = 0; i < x.length; i++) {
        if(x[i].classList.contains('autocomplete-active')) {
          found = i + 1;
          break;
        }
      }
      self.add_active(x[found]);
    } else if (e.keyCode == 38) { // up
      for(i = 0; i < x.length; i++) {
        if(x[i].classList.contains('autocomplete-active')) {
          found = i - 1;
          break;
        }
      }
      self.add_active(x[found]);
    } else if (e.keyCode == 13) { // enter
      if(self.focus){
        self.focus.click();
      }
    }
  },

  on_change: function (e) {
    var self = this;
    self.template.query.function_score.query.bool.must.bool.must[0].query_string.query = encodeURIComponent(self.context.value);
    self.source.value = JSON.stringify(self.template);
  },

  on_submit: function (e) {
    var self = this;
    if(self.context.value){
      self.context.placeholder = self.context.value;
      self.context.value = '';
    }
  },

  close_all_lists: function (e) {
    var self = this;
    self.focus = null;
    while (self.autocomplete.firstChild) {
      self.autocomplete.removeChild(self.autocomplete.firstChild);
    }
  },

  add_active: function (elem) {
    var self = this;
    if (!elem) {
      return false;
    }

    self.remove_active();
    self.focus = elem;
    elem.classList.add("autocomplete-active");
  },

  remove_active: function () {
    var self = this;
    self.focus = null;
    var x = self.autocomplete.getElementsByTagName("div");
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
};

window.addEventListener("load", function(event) {
  var i, gsc_cs, gsc_inputs = document.getElementsByClassName('gsc-input-query');
  for(i=0; i < gsc_inputs.length; i++) {
    gsc_cs = new EEA.CustomSearch(gsc_inputs[i]);
  }
});
