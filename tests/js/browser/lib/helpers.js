// Helpers intended to be used with Nightmare's `evaluate` function to examine client-side content.
//
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.test.handlebars.browser");

/* globals $ */

gpii.test.handlebars.browser.equalThingsAreTrue = function (path, fnName) {
    var element = fnName ? $(path)[fnName]() : $(path);
    var equalCandidates = element.find(".equal");
    for (var a = 0; a < equalCandidates.length; a++) {
        if ($(equalCandidates[a]).text() !== "true") {
            return false;
        }
    }

    return true;
};

gpii.test.handlebars.browser.unequalThingsAreFalse = function (path, fnName) {
    var element = fnName ? $(path)[fnName]() : $(path);
    var unequalCandidates = element.find(".unequal");
    for (var b = 0; b < unequalCandidates.length; b++) {
        if ($(unequalCandidates[b]).text() !== "false") {
            return false;
        }
    }

    return true;
};

gpii.test.handlebars.browser.getJSONContent = function (path) {
    return JSON.parse($(path).html());
};
