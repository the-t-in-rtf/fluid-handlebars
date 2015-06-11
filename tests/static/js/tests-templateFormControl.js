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
        success: "common-success",
        error:   "common-error"
    }
});

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForSuccess");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForSuccess", {
    gradeNames: ["gpii.hb.tests.templateFormControl", "autoInit"],
    ajaxUrl: "/content/json/success.json",
    model: {
        buttonName: "Succeed"
    },
    rules: {
        success: {
            model: {
                record: "record"
            }
        }
    },
    templates: {
        initial: "form-success-initial",
        success: "form-success"
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
        initial: "form-failure-initial"
    }
});

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForAmbiguity");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForAmbiguity", {
    gradeNames: ["gpii.hb.tests.templateFormControl", "autoInit"],
    ajaxUrl: "/content/json/error.json", // An error, delivered with a 200 status code.
    model: {
        buttonName: "Dither"
    },
    templates: {
        initial: "form-ambiguous-initial",
        error:   "form-ambiguous-error"
    }
});


fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForKeys");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForKeys", {
    gradeNames:    ["gpii.hb.tests.templateFormControl", "autoInit"],
    hideOnSuccess: false,
    ajaxUrl: "/content/json/success.json",
    templates: {
        initial: "form-keyed-initial"
    }
});