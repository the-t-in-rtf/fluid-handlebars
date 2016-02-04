// Helpers intended to be used with Nightmare's `evaluate` function to examine client-side content.
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.templates.tests.browser");

/* globals $ */

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