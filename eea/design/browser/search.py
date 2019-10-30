""" Redirect to glossary.eea.europa.eu
"""
import json
import logging
import copy 
from urllib import urlencode
from eventlet.green import urllib2
from contextlib import closing
from eea.cache import cache
from Products.Five.browser import BrowserView

logger = logging.getLogger("eea.design")
GLOSSARY = "http://glossary.{lang}.eea.europa.eu"
SEARCH = "/terminology/sitesearch?term="
AUTOCOMPLETE = "http://search.apps.eea.europa.eu/tools/api"
TIMEOUT = 3

class Glossary(BrowserView):
    """ Glossary searcb
    """
    def __call__(self, *args, **kwargs):
        lang = self.request.get("LANGUAGE", "en")
        if len(lang) > 2:
            lang = "en"

        url = GLOSSARY.format(lang=lang)
        term = self.request.get("term", "")
        if not term:
            return self.request.response.redirect(url)

        url += SEARCH
        if isinstance(term, unicode):
            term = term.encode('utf-8')

        url += term
        self.request.response.redirect(url)


class Tags(BrowserView):
    """ Get search auto-complete tags
    """
    @cache(lambda *args, **kwargs: kwargs.get('q', ''), lifetime=3600)
    def tags(self, q=''):
        """ Get autocompletion tags
        """
        if not q:
            return []
        
        """ Get suggestions
        """
        terms = q.split(" ")
        
        suggest_query = {
            "size": 0,
            "suggest": {}
        }
        did_you_mean_template = {
            "text": "*",
            "phrase": {
                "field": "did_you_mean"
            }
        }
        
        for term in range(len(terms)):
            suggest_query["suggest"]["did_you_mean_" + str(term)] = copy.deepcopy(did_you_mean_template)
            suggest_query["suggest"]["did_you_mean_" + str(term)]["text"] = terms[term]

        suggest_url = "?".join((
            AUTOCOMPLETE,
            urlencode({"source": json.dumps(suggest_query)})
        ))

        try:
            with closing(urllib2.urlopen(suggest_url, timeout=TIMEOUT)) as con:
                res = json.loads(con.read())
        except Exception as err:
            logger.debug("%s - %s", suggest_url, err)
            res = {}
            
        """ Reconstruct q
        """
        words = 0
        suggested_terms = []
        
        while True:
            key = "did_you_mean_" + str(words)
            if res["suggest"].get(key):
                if res["suggest"][key][0].get("options") and len(res["suggest"][key][0].get("options")) == 0:
                    suggested_terms.append(res["suggest"][key][0]["text"])
                elif res["suggest"][key][0].get("options") and res["suggest"][key][0]["options"][0].get("text"):
                    suggested_terms.append(res["suggest"][key][0]["options"][0]["text"])
                else:
                    suggested_terms.append(terms[words])
            else:
                break
            words += 1

        autocomplete_query = {
            "size": 0,
            "aggs": {
                "autocomplete_full": {
                    "terms": {
                        "field": "autocomplete",
                        "order": {
                            "_count": "desc"
                        },
                        "include": "%s.*" % " ".join(suggested_terms)
                    }
                },
                "autocomplete_last": {
                    "terms": {
                        "field": "autocomplete",
                        "order": {
                            "_count": "desc"
                        },
                        "include": "%s.*" % " ".join(suggested_terms).split()[-1]
                    }
                }
            }
        }

        url = "?".join((
            AUTOCOMPLETE,
            urlencode({"source": json.dumps(autocomplete_query)})
        ))

        try:
            with closing(urllib2.urlopen(url, timeout=TIMEOUT)) as con:
                res = json.loads(con.read())
        except Exception as err:
            logger.debug("%s - %s", url, err)
            res = {}

        return [doc.get('key') for doc in res.get("aggregations", {}).get(
            "autocomplete_full", {}).get("buckets", [])]

    def __call__(self, **kwargs):
        if self.request:
            form = getattr(self.request, 'form', {})
            kwargs.update(form)
        return json.dumps(self.tags(q=kwargs.get("q", "")))
