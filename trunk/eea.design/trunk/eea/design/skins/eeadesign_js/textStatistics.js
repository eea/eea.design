// TextStatistics.js
// Christopher Giffard (2012)
// 1:1 API Fork of TextStatistics.php by Dave Child (Thanks mate!)
// https://github.com/DaveChild/Text-Statistics


(function(glob) {

    var TextStatistics = function TextStatistics(text) {
        this.text = text ? this.cleanText(text) : "";
    };

    TextStatistics.prototype.cleanText = function(text) {
        // all these tags should be preceeded by a full stop.
        // return text if it's the same as the text saved on the plugin
        // since it was already cleaned
        var txt = text;
        if (this.text && txt === this.text) {
            return txt;
        }
        var fullStopTags = ['li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dd'];

        fullStopTags.forEach(function(tag) {
            // use regex search in order to replace all found tags not just first entry
            txt = txt.replace(new RegExp("</" + tag + ">", 'g'), ".");
        });

        txt = txt.replace(/<[^>]+>/g, "") // Strip tags
            .replace(/[,:;()\-]/, " ") // Replace commans, hyphens etc (count them as spaces)
            .replace(/[\.!?]/, ".") // Unify terminators
            .replace(/^\s+/, "") // Strip leading whitespace
            .replace(/[ ]*(\n|\r\n|\r)[ ]*/, " ") // Replace new lines with spaces
            .replace(/([\.])[\. ]+/, ".") // Check for duplicated terminators
            .replace(/[ ]*([\.])/, ". ") // Pad sentence terminators
            .replace(/\s+/, " ") // Remove multiple spaces
            .replace(/\s+$/, ""); // Strip trailing whitespace

        if (txt.charAt(txt.length - 1) !== ".") {
            txt += "."; // Add final terminator, in case it's missing.
        }
        return txt;
    };

    TextStatistics.prototype.fleschKincaidReadingEase = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        return Math.round((206.835 - (1.015 * this.averageWordsPerSentence(txt)) - (84.6 * this.averageSyllablesPerWord(txt))) * 10) / 10;
    };

    TextStatistics.prototype.fleschKincaidGradeLevel = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        return Math.round(((0.39 * this.averageWordsPerSentence(txt)) + (11.8 * this.averageSyllablesPerWord(txt)) - 15.59) * 10) / 10;
    };

    TextStatistics.prototype.gunningFogScore = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        return Math.round(((this.averageWordsPerSentence(txt) + this.percentageWordsWithThreeSyllables(txt, false)) * 0.4) * 10) / 10;
    };

    TextStatistics.prototype.colemanLiauIndex = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        return Math.round(((5.89 * (this.letterCount(txt) / this.wordCount(txt))) - (0.3 * (this.sentenceCount(txt) / this.wordCount(txt))) - 15.8) * 10) / 10;
    };

    TextStatistics.prototype.smogIndex = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        return Math.round(1.043 * Math.sqrt((this.wordsWithThreeSyllables(txt) * (30 / this.sentenceCount(txt))) + 3.1291) * 10) / 10;
    };

    TextStatistics.prototype.automatedReadabilityIndex = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        return Math.round(((4.71 * (this.letterCount(txt) / this.wordCount(txt))) + (0.5 * (this.wordCount(txt) / this.sentenceCount(txt))) - 21.43) * 10) / 10;
    };

    TextStatistics.prototype.textLength = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        return txt.length;
    };

    TextStatistics.prototype.letterCount = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        txt = txt.replace(/[^a-z]+/ig, "");
        return txt.length;
    };

    TextStatistics.prototype.sentenceCount = function(text) {
        var txt = text ? this.cleanText(text) : this.text;

        // Will be tripped up by "Mr." or "U.K.". Not a major concern at this point.
        return txt.replace(/[^\.!?]/g, '').length || 1;
    };

    TextStatistics.prototype.wordCount = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        return txt.split(/[^a-z0-9]+/i).length || 1;
    };

    TextStatistics.prototype.averageWordsPerSentence = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        return this.wordCount(txt) / this.sentenceCount(txt);
    };

    TextStatistics.prototype.averageCharactersPerWord = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        return this.letterCount(txt) / this.wordCount(txt);
    };

    TextStatistics.prototype.averageSyllablesPerWord = function(text) {
        var txt = text ? this.cleanText(text) : this.text;
        var syllableCount = 0,
            wordCount = this.wordCount(txt),
            self = this;

        txt.split(/\s+/).forEach(function(word) {
            syllableCount += self.syllableCount(word);
        });

        // Prevent NaN...
        return (syllableCount || 1) / (wordCount || 1);
    };

    TextStatistics.prototype.wordsWithThreeSyllables = function(text, countProperNouns) {
        var txt = text ? this.cleanText(text) : this.text;
        var longWordCount = 0,
            self = this;

        var lcountProperNouns = countProperNouns !== false;

        txt.split(/\s+/).forEach(function(word) {

            // We don't count proper nouns or capitalised words if the countProperNouns attribute is set.
            // Defaults to true.
            if (!word.match(/^[A-Z]/) || lcountProperNouns) {
                if (self.syllableCount(word) > 2) { longWordCount++; }
            }
        });

        return longWordCount;
    };

    TextStatistics.prototype.percentageWordsWithThreeSyllables = function(text, countProperNouns) {
        var txt = text ? this.cleanText(text) : this.text;

        return (this.wordsWithThreeSyllables(txt, countProperNouns) / this.wordCount(txt)) * 100;
    };

    TextStatistics.prototype.syllableCount = function(word) {
        var syllableCount = 0,
            prefixSuffixCount = 0,
            wordPartCount = 0;

        // Prepare word - make lower case and remove non-word characters
        var lword = word.toLowerCase().replace(/[^a-z]/g, "");

        // Specific common exceptions that don't follow the rule set below are handled individually
        // Array of problem words (with word as key, syllable count as value)
        var problemWords = {
            "simile": 3,
            "forever": 3,
            "shoreline": 2
        };

        // Return if we've hit one of those...
        if (problemWords.hasOwnProperty(lword)) { return problemWords[lword]; }

        // These syllables would be counted as two but should be one
        var subSyllables = [/cial/, /tia/, /cius/, /cious/, /giu/, /ion/, /iou/, /sia$/, /[^aeiuoyt]{2,}ed$/, /.ely$/, /[cg]h?e[rsd]?$/, /rved?$/, /[aeiouy][dt]es?$/, /[aeiouy][^aeiouydt]e[rsd]?$/, /^[dr]e[aeiou][^aeiou]+$/, // Sorts out deal, deign etc
            /[aeiouy]rse$/ // Purse, hearse
        ];

        // These syllables would be counted as one but should be two
        var addSyllables = [/ia/, /riet/, /dien/, /iu/, /io/, /ii/, /[aeiouym]bl$/, /[aeiou]{3}/, /^mc/, /ism$/, /([^aeiouy])\1l$/, /[^l]lien/, /^coa[dglx]./, /[^gq]ua[^auieo]/, /dnt$/, /uity$/, /ie(r|st)$/];

        // Single syllable prefixes and suffixes
        var prefixSuffix = [/^un/, /^fore/, /ly$/, /less$/, /ful$/, /ers?$/, /ings?$/];

        // Remove prefixes and suffixes and count how many were taken
        prefixSuffix.forEach(function(regex) {
            if (lword.match(regex)) {
                lword = lword.replace(regex, "");
                prefixSuffixCount++;
            }
        });

        wordPartCount = lword.split(/[^aeiouy]+/ig)
            .filter(function(wordPart) {
                return !!wordPart.replace(/\s+/ig, "").length;
            })
            .length;

        // Get preliminary syllable count...
        syllableCount = wordPartCount + prefixSuffixCount;

        // Some syllables do not follow normal rules - check for them
        subSyllables.forEach(function(syllable) {
            if (lword.match(syllable)) { syllableCount--; }
        });

        addSyllables.forEach(function(syllable) {
            if (lword.match(syllable)) { syllableCount++; }
        });

        return syllableCount || 1;
    };

    function textStatistics(text) {
        return new TextStatistics(text);
    }

    (typeof module != "undefined" && module.exports) ? (module.exports = textStatistics) : (typeof define != "undefined" ? (define("textstatistics", [], function() {
        return textStatistics;
    })) : (glob.textstatistics = textStatistics));
}(this));
