/*

    Test the i18n helper functions in isolation.

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
var jqUnit = require("node-jqunit");

fluid.require("%gpii-handlebars");

jqUnit.module("Unit tests for i18n functions.");

jqUnit.test("Testing message loading.", function () {
    var messageBundle = gpii.handlebars.i18n.loadMessages(["%gpii-handlebars/tests/messages/primary", "%gpii-handlebars/tests/messages/secondary"], "en_us");

    jqUnit.assertEquals("Locale content should have been loaded as expected.", "Things are fine.", fluid.get(messageBundle, "en_us.how-are-things"));

    jqUnit.assertEquals("Content with no language/locale should be stored in the default locale.", "Yes, this works.", fluid.get(messageBundle, "en_us.files-without-suffixes-stored-in-default-locale"));

    jqUnit.assertEquals("Locale content from the primary directory should have been added to the language data.", "Things are fine.", fluid.get(messageBundle, "en.how-are-things"));

    jqUnit.assertEquals("Content should have been added from a secondary directory.", "Works just fine.", fluid.get(messageBundle, "en_us.unique-to-secondary-dir"));
    jqUnit.assertEquals("Content should have been merged from a secondary directory.", "Young.  I feel young.", fluid.get(messageBundle, "en_us.merged-key"));
    jqUnit.assertEquals("Unique locale content from a secondary directory should have been added to the language data.", "Works just fine.", fluid.get(messageBundle, "en.unique-to-secondary-dir"));
});

jqUnit.test("Testing message loading error handling.", function () {
    var messageBundle = gpii.handlebars.i18n.loadMessages(["%non-existing-package/messages", "/bad/path/messages"]);
    jqUnit.assertDeepEq("An empty message bundle should be returned if no valid message directories are provided.", {}, messageBundle);
});

/*
{
  "en_gb": {
    "four-oh-four": "Oh dear.  Nothing here.",
    "how-are-things": "Things are tolerable.",
    "noQuotes": "Quote 'works' unquote.",
    "hasComment": "No comment at this time.",
    "message-key-from-uppercase": "IT WORKS!"
  },
  "en": {
    "four-oh-four": "Page not found.",
    "message-key-language-only": "Works.",
    "unique-to-secondary-dir": "Works just fine.",
    "merged-key": "Young.  I feel young.",
    "files-without-suffixes-stored-in-default-locale": "Yes, this works.",
    "how-are-things": "This is fine.",
    "shallow-variable": "This is %condition.",
    "deep-variable": "This is even %deep.value.",
    "noQuotes": "Quote 'works' unquote.",
    "hasComment": "No comment at this time.",
    "message-key-from-uppercase": "IT WORKS!"
  },
  "nl_be": {
    "keyboard": "klavier",
    "four-oh-four": "Hier is er geen kat."
  },
  "nl": {
    "how-are-things": "Het gaat goed.",
    "wave": "golf",
    "four-oh-four": "Hier is er geen hond.",
    "keyboard": "toetesenbord",
    "microwave": "magnetron"
  },
  "nl_nl": {
    "four-oh-four": "Hier is er geen hond.",
    "keyboard": "toetesenbord",
    "microwave": "magnetron"
  },
  "en_us": {
    "unique-to-secondary-dir": "Works just fine.",
    "merged-key": "Young.  I feel young.",
    "files-without-suffixes-stored-in-default-locale": "Yes, this works.",
    "four-oh-four": "Nothing to see here.",
    "how-are-things": "This is fine.",
    "shallow-variable": "This is %condition.",
    "deep-variable": "This is even %deep.value."
  }
}
*/

jqUnit.test("Testing deriving messages from message bundle by language/locale.", function () {
    var messageBundles = gpii.handlebars.i18n.loadMessages(["%gpii-handlebars/tests/messages/primary", "%gpii-handlebars/tests/messages/secondary"], "en_us");

    var nlNlMessages =  gpii.handlebars.i18n.deriveMessageBundle("nl_nl", messageBundles);
    jqUnit.assertEquals("Locale specific data should be included in a bundle derived from a locale.", "Hier is er geen hond.", fluid.get(nlNlMessages, "four-oh-four"));
    jqUnit.assertEquals("Language data should be included in a bundle derived from a locale.", "Het gaat goed.", fluid.get(nlNlMessages, "how-are-things"));
    jqUnit.assertEquals("Unique data from the default locale should be included in a bundle derived from a locale.", "This is %condition.", fluid.get(nlNlMessages, "shallow-variable"));

    var nlBeMessages =  gpii.handlebars.i18n.deriveMessageBundle("nl_be", messageBundles);
    jqUnit.assertEquals("Locale specific data should be included in a bundle derived from a locale.", "Hier is er geen kat.", fluid.get(nlBeMessages, "four-oh-four"));
    jqUnit.assertEquals("Language data should be included in a bundle derived from a locale.", "Het gaat goed.", fluid.get(nlBeMessages, "how-are-things"));
    jqUnit.assertEquals("Unique from a locale with the same language should be included in a bundle derived from a locale.", "golf", fluid.get(nlBeMessages, "wave"));
});

jqUnit.test("Testing language detection from locale.", function () {
    jqUnit.assertEquals("A valid locale should return a language.", "en", gpii.handlebars.i18n.languageFromLocale("en_us"));
    jqUnit.assertEquals("Upper-case locale data should result in a lower case language.", "en", gpii.handlebars.i18n.languageFromLocale("EN_US"));
    jqUnit.assertEquals("A nonsensical locale should by handled correctly.", undefined, gpii.handlebars.i18n.languageFromLocale("Narnia"));
    jqUnit.assertEquals("An undefined locale should by handled correctly.", undefined, gpii.handlebars.i18n.languageFromLocale(undefined));
    jqUnit.assertEquals("A null locale should by handled correctly.", undefined, gpii.handlebars.i18n.languageFromLocale(null));
});
