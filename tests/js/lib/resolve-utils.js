// Convenience function to wrap a `when.js` resolver in a short timeout.
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.templates.tests.resolver");
gpii.templates.tests.resolver.getDelayedResolutionFunction = function (resolver, timeout) {
    timeout = timeout ? timeout : 500;
    return function () {
        setTimeout(resolver, timeout);
    };
};