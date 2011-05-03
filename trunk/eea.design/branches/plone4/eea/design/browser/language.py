import zope.interface
from Acquisition import aq_inner
from Acquisition import aq_parent
from Products.Five import BrowserView
from Products.CMFCore.utils import getToolByName

from interfaces import ILanguages

from plone.memoize.ram import cache
#TODO: delete this file when EEAContentTypes is ported to plone 4
def cacheKey(method, self):
    request = self.request
    return (method.__name__, request.get('LANGUAGE', 'en'))

class Languages(BrowserView):
    """ Return different languages for translation of content and for local sites.  """

    zope.interface.implements(ILanguages)

    def getTranslationLanguages(self):
        pl = getToolByName(self.context, 'portal_languages')
        site_languages = pl.listSupportedLanguages()
        site_languages.sort()
        return site_languages

    def getTranslatedSitesLanguages(self):
        languages = self.getTranslationLanguages()
        def _cmp(a, b):
            cmp_one = a[1]
            cmp_two = b[1]
            if a[0] == 'bg':
                cmp_one = 'B'
            if b[0] == 'bg':
                cmp_two = 'B'
            if a[0] == 'cs':
                cmp_one = 'C'
            if b[0] == 'cs':
                cmp_two = 'C'
            if a[0] == 'el':
                cmp_one = 'Eet'
            if b[0] == 'el':
                cmp_two = 'Eet'
            if a[0] == 'is':
                cmp_one = 'Is'
            if b[0] == 'is':
                cmp_two = 'Is'
            return cmp(cmp_one, cmp_two)
        languages.sort(_cmp)
        exclude = ['ru','sr', 'ga']
        return [ lang for lang in languages
                      if lang[0] not in exclude ]

    @cache(cacheKey)
    def getLocalSites(self):
        languages = self.getTranslatedSitesLanguages()
        sites = []
        portal_url = getToolByName(self.context, 'portal_url')
        portal = portal_url.getPortalObject()
        site = getattr(portal, 'SITE', None)
        for lang in languages:
            langcode = lang[0]
            url = 'http://local.%s.eea.europa.eu' % langcode
            if site is not None:
                localSite = site.getTranslation(langcode)
                if localSite is not None:
                    url = localSite.absolute_url()
            sites.append( { 'lang' : lang[1],
                            'langcode' : langcode,
                            'url' : url } )
        return sites

class LanguageSelectorData(BrowserView):
    """ VIEWified languageSelectorData.py from LinguaPlone/skins/ so we can test it """

    def data(self):
        context = self.context
        results = []
        putils = getToolByName(self.context, 'plone_utils')

        translations = {} # lang:[object, wfstate]
        if context.isTranslatable():
            translations = context.getTranslations()

        if context.portal_membership.isAnonymousUser():
            published = {}
            for k, v in translations.items():
                if v[1] == 'published':
                    published[k] = v
            if len(published) > 1:
                translations = published
            else:
                return results

        langtool = context.portal_languages
        site_languages = langtool.listSupportedLanguages()
        if hasattr(context, 'getLanguage'):
            current_language = context.getLanguage()
        else:
            current_language = langtool.getPreferredLanguage()

        #catalog = context.portal_catalog

        site_languages.sort()
        for code, name in site_languages:
            if not isinstance(name, unicode):
                name = unicode(name, 'utf-8')
            current = code == current_language
            available = translations.has_key(code)
            alt = context.translate(msgid='label_switch_language_to',
                                    default=u'Switch language to ${language}',
                                    mapping={'language': name},
                                    domain='linguaplone')

            lingua_state = None
            if available:
                translation = translations[code][0]
                if putils.isDefaultPage(translation):
                    translation = aq_parent(aq_inner(translation))


                url = translation.absolute_url()
                if translation.portal_type in ('ATFile', 'File'):
                    url += '/view'

                wf = context.portal_workflow
                lingua_state = wf.getInfoFor(translation, 'review_state', None, 'linguaflow')


            elif context.Language() == '':
                url = context.absolute_url()
                alt += context.translate(msgid='label_content_is_language_neutral',
                                         default=u' (Content is language neutral)',
                                         domain='linguaplone')
            else:
                url = '%s/%s' % (context.absolute_url(), 'not_available_lang')
                alt += context.translate(msgid='label_content_translation_not_available',
                                         default=u' (Content translation not available)',
                                         domain='linguaplone')

            results.append({'Language':code, 'Title':name, 'current':current,
                            'flag': langtool.getFlagForLanguageCode(code),
                            'available':available, 'change_url':url, 'alt':alt,
                            'invalid': lingua_state == 'invalid'})
        return results


