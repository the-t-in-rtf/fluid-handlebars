/*

    Functions to assist in internationalising and localising content.

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var fs = require("fs");
var path = require("path");
var JSON5 = require("json5");

require("./resolver");

fluid.registerNamespace("gpii.handlebars.i18n");

/**
 *
 * Derive a single message bundle from all available languages and locales, based on the `Accept-Language` headers
 * passed as part of `request`.  Returns a combination of all messages found matching the following:
 *
 * 1. The user's locale.
 * 2. The user's language.
 * 3. The default locale.
 *
 * @param request {Object} - An express request object: http://expressjs.com/en/4x/api.html#req
 * @param messageBundles {Object} - The full set of all message bundles available, keyed by locale or language.
 * @param defaultLocale {String} - The default locale.
 *
 */
gpii.handlebars.i18n.deriveMessageBundleFromRequest = function (request, messageBundles, defaultLocale) {
    var localesAndLanguages = gpii.handlebars.i18n.languagesAndLocalesFromMessageBundle(messageBundles, defaultLocale);
    var localeFromHeaders = request.acceptsLanguages.apply(request, localesAndLanguages);
    var preferredLocale = localeFromHeaders ? localeFromHeaders.replace("-", "_") : defaultLocale;
    return gpii.handlebars.i18n.deriveMessageBundle(preferredLocale, messageBundles, defaultLocale);
};

/**
 *
 * Derive a single message bundle from all available languages and locales, based on the `Accept-Language` headers
 * passed as part of `request`.  Returns a combination of all messages found matching the following:
 *
 * 1. The user's locale.
 * 2. The user's language.
 * 3. The default locale.
 *
 * @param locale {String} - The locale to use.
 * @param messageBundles {Object} - The full set of all message bundles available, keyed by locale or language.
 *
 */
gpii.handlebars.i18n.deriveMessageBundle = function (preferredLocale, messageBundles, defaultLocale) {
    defaultLocale = defaultLocale || "en_us";
    preferredLocale = preferredLocale || defaultLocale;

    var defaultMessages = fluid.get(messageBundles, defaultLocale);

    var languageMessages = {};
    // Look up any messages inherited from the language portion of the locale, and use those instead of the defaults.
    var preferredLanguage = gpii.handlebars.i18n.languageFromLocale(preferredLocale);
    if (preferredLanguage && fluid.get(messageBundles, preferredLanguage)) {
        languageMessages = messageBundles[preferredLanguage];
    }

    var combinedMessageBundle = fluid.copy(languageMessages);

    // The default locale wins out over messages inherited from the underlying language.
    if (preferredLocale === defaultLocale) {
        combinedMessageBundle = fluid.merge({}, combinedMessageBundle, defaultMessages);
    }
    // If we are not using the default locale and there are messages for our locale, those win over anything we've collected so far.
    else if (fluid.get(messageBundles, preferredLocale)) {
        combinedMessageBundle = fluid.merge({}, defaultMessages, combinedMessageBundle, messageBundles[preferredLocale]);
    }

    return combinedMessageBundle;
};

/**
 *
 * A sorting function which we use to prefer locales over languages.
 *
 * @param a {String} - A string representing a language or locale.
 * @param b {String} - Another string representing a language or locale.
 * @returns {Integer} - A positive number if the second item is longer, a negative number if the first item is longer, or zero if the items are of the same length.
 *
 */
gpii.handlebars.i18n.sortByDescendingLength = function (a, b) {
    return b.length - a.length;
};

/**
 *
 * Derive the full list of languages and locales from our "bundle of bundles".  Sanitises the keys so that they can be
 * used with `request.acceptsLanguages`, which expects locales to be of the form `en-us` rather than using underscores.
 *
 * @param messageBundle {Object} - The "bundle of message bundles" containing all messages from all supported languages.
 * @param defaultLocale {String} - The default locale.
 * @returns {Array} - An array of strings starting with the default locale, and then all locales and languages, sorted in descending order by length.
 *
 */
gpii.handlebars.i18n.languagesAndLocalesFromMessageBundle = function (messageBundle, defaultLocale) {
    var rawKeys = Object.keys(messageBundle);
    rawKeys.sort(gpii.handlebars.inlineMessageBundlingMiddleware.request.sortByDescendingLength);
    // Always make sure the default locale is first so that wildcard matching (or the lack of headers results in using the default locale.
    var defaultFirstThenSorted = [defaultLocale].concat(rawKeys);
    var sanitisedKeys = defaultFirstThenSorted.map(function (entry) { return entry.replace("_", "-");});
    return sanitisedKeys;
};

/**
 *
 * Derive the language (ex: "en") from the locale (ex: "en_US").
 *
 * @param localeString {String} - The locale string.
 * @return {String|undefined} - The language if found, otherwise `undefined`.
 *
 */
gpii.handlebars.i18n.languageFromLocale = function (localeString) {
    if (localeString && localeString.toLowerCase) {
        var matches = localeString.toLowerCase().match(/^([a-z]{2})[-_][a-z]{2}$/);
        return fluid.get(matches, "1");
    }
    return undefined;
};

/**
 *
 * Load our all message bundles from one or more directories and organise them into a single object.
 *
 * @param messageDirs {Array} - An array of full or package-relative paths to directories containing message bundles.
 * @param defaultLocale {String} - The default locale to use for files that do not provide language or locale data.
 * @returns {Object} - A combined bundle of message bundles, keyed by locales and languages.
 *
 */
gpii.handlebars.i18n.loadMessages = function (messageDirs, defaultLocale) {
    defaultLocale = defaultLocale || "en_us";
    var messageBundles = {};
    var resolvedMessageDirs = gpii.express.hb.resolveAllPaths(messageDirs);

    var filesByLocale   = {};
    var filesByLanguage = {};

    fluid.each(resolvedMessageDirs, function (messageDir) {
        var resolvedPath = fluid.module.resolvePath(messageDir);
        try {
            var files = fs.readdirSync(resolvedPath);
            fluid.each(files, function (filename) {
                var fullPath = path.resolve(resolvedPath, filename);
                var matchesLocale = filename.toLowerCase().match(/.+[-_]([a-z]{2}[-_][a-z]{2})\.json5?/);
                var matchesLanguage = filename.toLowerCase().match(/.+[-_]([a-z]{2})\.json5?/);

                if (matchesLocale) {
                    var preferredLocale = matchesLocale[1];
                    if (!filesByLocale[preferredLocale]) { filesByLocale[preferredLocale] = []; }
                    filesByLocale[preferredLocale].push(fullPath);
                }
                else if (matchesLanguage) {
                    var preferredLanguage = matchesLanguage[1];
                    if (!filesByLanguage[preferredLanguage]) { filesByLanguage[preferredLanguage] = []; }
                    filesByLanguage[preferredLanguage].push(fullPath);
                }
                else {
                    if (!filesByLocale[defaultLocale]) { filesByLocale[defaultLocale] = []; }
                    filesByLocale[defaultLocale].push(fullPath);
                }
            });
        }
        catch (error) {
            fluid.log("Error loading directory '", resolvedPath, "':", error);
        }
    });

    // Load all locales, propagating data back to the language as well.
    fluid.each(filesByLocale, function (files, locale) {
        fluid.each(files, function (fullPath) {
            var data = JSON5.parse(fs.readFileSync(fullPath, "utf8"));
            messageBundles[locale] = fluid.merge({}, messageBundles[locale], data);

            // Add any unique material from the locale to the language, taking care to prefer existing language data.
            var languageFromLocale = gpii.handlebars.i18n.languageFromLocale(locale);
            messageBundles[languageFromLocale] = fluid.merge({}, messageBundles[languageFromLocale], data);
        });
    });

    // Load all languages, overwriting any data inherited from locales.
    fluid.each(filesByLanguage, function (files, language) {
        fluid.each(files, function (fullPath) {
            var data = JSON5.parse(fs.readFileSync(fullPath, "utf8"));
            messageBundles[language] = fluid.merge({}, messageBundles[language], data);
        });
    });

    return messageBundles;
};

fluid.registerNamespace("gpii.handlebars.i18n.messageLoader");

gpii.handlebars.i18n.messageLoader.loadMessages =  function (that) {
    that.applier.change("messageBundles", gpii.handlebars.i18n.loadMessages(that.options.messageDirs, that.options.defaultLocale));
    that.events.onMessagesLoaded.fire(that);
};

fluid.defaults("gpii.handlebars.i18n.messageLoader", {
    gradeNames: ["fluid.modelComponent"],
    defaultLocale: "en_us",
    mergePolicy: {
        messageDirs: "nomerge"
    },
    messageDirs: [],
    members: {
        messageBundles: {}
    },
    events: {
        loadMessages: null,
        onMessagesLoaded: null
    },
    listeners: {
        "onCreate.loadMessages": {
            func: "{that}.events.loadMessages.fire"
        },
        "loadMessages.loadMessages": {
            funcName: "gpii.handlebars.i18n.messageLoader.loadMessages",
            args:     ["{that}"]
        }
    }
});
