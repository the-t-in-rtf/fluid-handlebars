// Helpers intended to be used with Nightmare's `evaluate` function to examine client-side content.
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.templates.tests.browser");

/* globals $ */
/*

 Look up an element using the jQuery selector `path`.  By default, returns the element's HTML for further inspection.

 If `fnName` is supplied (such as "next" or "previous"), the element's named function will be executed.  That
 function is expected to return an object which has an `html` function.

 */
gpii.templates.tests.browser.getElementHtml = function (path, fnName) {
    return fnName ? $(path)[fnName]().html() : $(path).html();
};

/*

 Use the client-side jQuery to find an element matching `path`, and (by default) confirm if its HTML content matches `patternString`.

 Note that (as we are working with JSON configuration options), `patternString`is expected to be a string rather than an
 existing RegExp object.

 As with `getElementHtml`, if `fnName` is supplied, the element's named function will be executed and then the match
 will be checked.  That function is expected to return an object which has an `html` function.

 */
gpii.templates.tests.browser.elementMatches = function (path, patternString, fnName) {
    var element = fnName ? $(path)[fnName]() : $(path);
    return Boolean(element && element.html().match(new RegExp(patternString, "mi")));
};

gpii.templates.tests.browser.equalThingsAreTrue = function (path, fnName) {
    var element = fnName ? $(path)[fnName]() : $(path);
    var equalCandidates = element.find(".equal");
    for (var a = 0; a < equalCandidates.length; a++) {
        if ($(equalCandidates[a]).text() !== "true") {
            return false;
        }
    }

    return true;
};

gpii.templates.tests.browser.unequalThingsAreFalse = function (path, fnName) {
    var element = fnName ? $(path)[fnName]() : $(path);
    var unequalCandidates = element.find(".unequal");
    for (var b = 0; b < unequalCandidates.length; b++) {
        if ($(unequalCandidates[b]).text() !== "false") {
            return false;
        }
    }

    return true;
};

gpii.templates.tests.browser.getJSONContent = function (path) {
    return JSON.parse($(path).html());
};