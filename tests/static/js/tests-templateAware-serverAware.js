"use strict";
// Test the base "template aware" component.
//
// This is a test component that is meant to be included in a client-side document.
//
/* global fluid */
fluid.defaults("gpii.tests.templateAware", {
    gradeNames: ["gpii.handlebars.templateAware"],
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

// Grade for tests that are independent of the `initBlock` component.
fluid.defaults("gpii.tests.templateAware.serverAware", {
    gradeNames: ["gpii.handlebars.templateAware.serverAware", "gpii.tests.templateAware"]
});

fluid.defaults("gpii.tests.templateAware.contained", {
    gradeNames: ["gpii.tests.templateAware.serverAware"],
    template:  "form-contained-initial",
    selectors: {
        initial: ".contained-inner" // Update an interior element without disturbing the root container.
    }
});