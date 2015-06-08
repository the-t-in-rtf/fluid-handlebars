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
        "error":   "form-error",
        "success": "form-success"
    }
});

fluid.registerNamespace("gpii.hb.tests.templateAware.readyForSuccess");
fluid.defaults("gpii.hb.tests.templateAware.readyForSuccess", {
    gradeNames: ["gpii.hb.tests.templateAware", "autoInit"],
    ajaxUrl: "/content/json/success.json",
    model: {
        buttonName: "Succeed"
    },
    templates: {
        "initial": "form-success-initial"
    }
});

fluid.registerNamespace("gpii.hb.tests.templateAware.readyForFailure");
fluid.defaults("gpii.hb.tests.templateAware.readyForFailure", {
    gradeNames: ["gpii.hb.tests.templateAware", "autoInit"],
    ajaxUrl: "/error",
    model: {
        buttonName: "Fail"
    },
    templates: {
        "initial": "form-error-initial"
    }
});