"use strict";
// Test all "template aware" components.
//
// This is a test component that is meant to be included in a client-side document.
//
// To run these tests, you should look at zombie-tests.js, which will start the server and launch a headless browser.
//
/* global fluid */
fluid.registerNamespace("gpii.hb.tests.templateAware");

fluid.defaults("gpii.hb.tests.templateAware", {
    gradeNames: ["gpii.templates.hb.client.templateFormControl", "autoInit"],
    templates: {
        "initial": "form-initial",
        "error":   "form-error",
        "success": "form-success"
    },
    selectors: {
        initial: ".schmewport",
        error:   ".schmewport",
        success: ".schmewport"
    },
    ajaxUrl: "/error"
});