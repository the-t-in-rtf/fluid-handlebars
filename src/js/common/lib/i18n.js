/*

    Functions to assist in internationalising and localising content.

*/
/* eslint-env node */
"use strict";
var fluid = fluid || require("infusion");

fluid.registerNamespace("fluid.handlebars.i18n");

/**
 *
 * Parse the content of an `Accept-Language` header and return the full list of locales in order of preference.
 *
 * @param {String} header - The value of the `Accept-Language` header.
 * @return {String[]} - An array of strings representing locales and/or languages, in order of preference.
 *
 */
fluid.handlebars.i18n.getAllLocalesFromHeader = function (header) {
    var acceptedLanguages = [];
    if (typeof header === "string") {
        var localeSegments = header.trim().split(/ *, */);
        var segmentsAsObjects = [];
        localeSegments.forEach(function (localeSegment) {
            var subSegments = localeSegment.split(";q=");
            var segmentDef = {
                locale: subSegments[0],
                q: subSegments.length > 1 ? parseInt(subSegments[1], 10) : 1
            };
            segmentsAsObjects.push(segmentDef);
        });
        segmentsAsObjects.sort(fluid.handlebars.i18n.sortByQScore);
        segmentsAsObjects.map(function (entry) {
            acceptedLanguages.push(entry.locale);
        });
    }
    else {
        acceptedLanguages.push("*");
    }
    return acceptedLanguages.map(function (entry) { return entry.toLowerCase().replace("-", "_");});
};

/**
 *
 * Sort by the "q score" included with complex "Accept-Language" headers.
 *
 * @param {Object} a - A single weighted language entry.
 * @param {Object} b - Another weighted language to compare to `a`.
 * @return {Number} - -1 if `a` should come before `b`, 1 if `b` should come before `a`, 0 if their weights are equal.
 *
 */
fluid.handlebars.i18n.sortByQScore = function (a, b) {
    return b.q - a.q;
};

/**
 *
 * Derive the effective message bundle from the value of the `Accept-Language` header.
 *
 * @param {String} header - The `Accept-Language` header provided by the browser.  See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Language
 * @param {Object} messageBundles - The "bundle of message bundles" representing messages for all available languages.
 * @param {String} defaultLocale - The default locale to use if no language is specified (or if a wildcard is specified).
 * @return {Object} A message bundle containing messages for the most appropriate combination of locale, language, and defaults.
 *
 */
fluid.handlebars.i18n.deriveMessageBundleFromHeader = function (header, messageBundles, defaultLocale) {
    var localesAndLanguages = fluid.handlebars.i18n.languagesAndLocalesFromMessageBundle(messageBundles, defaultLocale);
    var allLocalesFromHeader = fluid.handlebars.i18n.getAllLocalesFromHeader(header);

    var preferredLanguageOrLocale = fluid.find(allLocalesFromHeader, function (candidateLocale) {
        if (candidateLocale === "*") {
            return defaultLocale;
        }
        else if (localesAndLanguages.indexOf(candidateLocale) !== -1) {
            return candidateLocale;
        }
    });

    return fluid.handlebars.i18n.deriveMessageBundle(preferredLanguageOrLocale, messageBundles, defaultLocale);
};

/**
 *
 * Derive a single message bundle from all available languages and locales, based on the `Accept-Language` headers
 * passed as part of `request`.  Returns a combination of all messages found matching the following:
 *
 * 1. The user's locale, if different than the default.
 * 2. The user's language, if different than the default.
 * 3. The default locale.
 * 4. The default language.
 *
 * @param {String} preferredLocale - The locale to use.
 * @param {Object} messageBundles - The full set of all message bundles available, keyed by locale or language.
 * @param {String} defaultLocale - The default locale.  Compared with `locale` to determine how material should be inherited from the defaults.
 * @return {Object} - A map of messages for a single locale.
 *
 */
fluid.handlebars.i18n.deriveMessageBundle = function (preferredLocale, messageBundles, defaultLocale) {
    defaultLocale = defaultLocale || "en_us";

    var messagesToMerge = [];

    var defaultLanguage = fluid.handlebars.i18n.languageFromLocale(defaultLocale);
    if (defaultLanguage && fluid.get(messageBundles, defaultLanguage)) {
        messagesToMerge.push(fluid.get(messageBundles, defaultLanguage));
    }

    messagesToMerge.push(fluid.get(messageBundles, defaultLocale));

    if (preferredLocale) {
        // Look up any messages inherited from the language portion of the locale, and use those instead of the defaults.
        var preferredLanguage = fluid.handlebars.i18n.languageFromLocale(preferredLocale);
        if (preferredLanguage && preferredLanguage !== defaultLanguage && fluid.get(messageBundles, preferredLanguage)) {
            messagesToMerge.push(messageBundles[preferredLanguage]);
        }

        // The default locale wins out over messages inherited from the underlying language, i.e. it should be later in the merge.
        if (preferredLocale !== defaultLocale && preferredLocale !== preferredLanguage && fluid.get(messageBundles, preferredLocale)) {
            messagesToMerge.push(messageBundles[preferredLocale]);
        }
    }

    var combinedMessageBundle = {};
    fluid.extend.apply(null, [true, combinedMessageBundle].concat(messagesToMerge));
    return combinedMessageBundle;
};

/**
 *
 * A sorting function which we use to prefer locales over languages.
 *
 * @param {String} a - A string representing a language or locale.
 * @param {String} b - Another string representing a language or locale.
 * @return {Integer} - A positive number if the second item is longer, a negative number if the first item is longer, or zero if the items are of the same length.
 *
 */
fluid.handlebars.i18n.sortByDescendingLength = function (a, b) {
    return b.length - a.length;
};

/**
 *
 * Derive the full list of languages and locales from our "bundle of bundles".  Sanitises the keys so that they can be
 * used with `request.acceptsLanguages`, which expects locales to be of the form `en-us` rather than using underscores.
 *
 * @param {Object} messageBundle - The "bundle of message bundles" containing all messages from all supported languages.
 * @param {String} defaultLocale - The default locale.
 * @return {String[]} - An array of strings starting with the default locale, and then all locales and languages, sorted in descending order by length.
 *
 */
fluid.handlebars.i18n.languagesAndLocalesFromMessageBundle = function (messageBundle, defaultLocale) {
    var rawKeys = Object.keys(messageBundle);
    rawKeys.sort(fluid.handlebars.i18n.sortByDescendingLength);

    // Always make sure the default locale is first so that wildcard matching (or the lack of headers results in using the default locale.
    return [defaultLocale].concat(rawKeys);
};

/**
 *
 * Derive the language (ex: "en") from the locale (ex: "en_US").
 *
 * @param {String} localeString - The locale string.
 * @return {String|undefined} - The language if found, otherwise `undefined`.
 *
 */
fluid.handlebars.i18n.languageFromLocale = function (localeString) {
    if (localeString && localeString.toLowerCase) {
        var matches = localeString.toLowerCase().match(/^([a-z]{2})[-_][a-z]{2}$/);
        return fluid.get(matches, "1");
    }
    return undefined;
};
