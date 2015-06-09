"use strict";
// Test the base "template aware" component.
//
// This is a test component that is meant to be included in a client-side document.
//
/* global fluid */
fluid.registerNamespace("gpii.hb.tests.templateAware");

fluid.defaults("gpii.hb.tests.templateAware", {
    gradeNames: ["gpii.templates.hb.client.templateAware", "autoInit"],
    template:   "index",
    model: {
        myvar:    "modelvariable",
        markdown: "*this works*",
        json:     { foo: "bar", baz: "quux", qux: "quux" }
    },
    invokers: {
        renderInitialMarkup: {
            funcName: "gpii.templates.hb.client.templateAware.renderMarkup",
            args: [
                "{that}",
                "", // Update our container
                "{that}.options.template",
                "{that}.model",
                "html"
            ]
        }

    }
});