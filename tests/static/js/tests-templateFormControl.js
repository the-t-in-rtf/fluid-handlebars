"use strict";
// Test all "template aware" components.
//
// This is a test component that is meant to be included in a client-side document.
//
/* global fluid */
fluid.registerNamespace("gpii.hb.tests.templateFormControl");

fluid.defaults("gpii.hb.tests.templateFormControl", {
    gradeNames: ["gpii.templates.hb.client.templateFormControl", "autoInit"],
    templates: {
        "error":   "form-error",
        "success": "form-success"
    }
});

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForSuccess");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForSuccess", {
    gradeNames: ["gpii.hb.tests.templateFormControl", "autoInit"],
    ajaxUrl: "/content/json/success.json",
    model: {
        buttonName: "Succeed"
    },
    templates: {
        "initial": "form-success-initial"
    }
});

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForFailure");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForFailure", {
    gradeNames: ["gpii.hb.tests.templateFormControl", "autoInit"],
    ajaxUrl: "/error",
    model: {
        buttonName: "Fail"
    },
    templates: {
        "initial": "form-error-initial"
    }
});