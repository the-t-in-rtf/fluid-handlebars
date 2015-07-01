"use strict";
// Test the base "template aware" component.
//
// This is a test component that is meant to be included in a client-side document.
//
/* global fluid */

fluid.defaults("gpii.tests.initBlock", {
    gradeNames: ["fluid.modelRelayComponent", "autoInit"],
    template:   "index",
    selectors: {
        initial: "" // Update the whole container
    },
    model: {
        myvar:    "modelvariable",
        markdown: "*this works*",
        json:     { foo: "bar", baz: "quux", qux: "quux" }
    },
    invokers: {
        renderInitialMarkup: {
            func: "{that}.renderMarkup",
            args: [ "initial", "{that}.options.template", "{that}.model", "html"]
        }
    }
});