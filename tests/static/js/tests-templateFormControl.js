"use strict";
// Test all "template aware" components.
//
// This is a test component that is meant to be included in a client-side document.
//
/* global fluid */
fluid.registerNamespace("gpii.tests.templateFormControl");

fluid.defaults("gpii.tests.templateFormControl", {
    gradeNames: ["gpii.templates.templateFormControl", "gpii.templates.templateAware.serverAware", "autoInit"],
    templates: {
        success: "common-success",
        error:   "common-error"
    },
    rules: {
        success: {
            successMessage: { literalValue: "The response was successful..." }
        },
        error: {
            errorMessage: { literalValue: "The response was not successful..." }
        }
    }
});

fluid.registerNamespace("gpii.tests.templateFormControl.readyForSuccess");
fluid.defaults("gpii.tests.templateFormControl.readyForSuccess", {
    gradeNames: ["gpii.tests.templateFormControl", "autoInit"],
    ajaxOptions: {
        url: "/content/json/success.json"
    },
    model: {
        buttonName: "Succeed"
    },
    templates: {
        initial: "form-success-initial",
        success: "form-success"
    }
});

fluid.registerNamespace("gpii.tests.templateFormControl.readyForStringifySuccess");
fluid.defaults("gpii.tests.templateFormControl.readyForStringifySuccess", {
    gradeNames: ["gpii.tests.templateFormControl.readyForSuccess", "autoInit"],
    ajaxOptions: {
        url:      "/content/stringifySuccess.txt",
        dataType: "json"
    },
    model: {
        buttonName: "Stringify Succeed"
    }
});

fluid.registerNamespace("gpii.tests.templateFormControl.readyForStringSuccess");
fluid.defaults("gpii.tests.templateFormControl.readyForStringSuccess", {
    gradeNames: ["gpii.tests.templateFormControl.readyForSuccess", "autoInit"],
    ajaxOptions: {
        url:      "/content/stringSuccess.txt"
    },
    rules: {
        success: {
            ok:             false,
            successMessage: "responseText"
        }
    },
    model: {
        buttonName: "String Succeed"
    }
});

fluid.registerNamespace("gpii.tests.templateFormControl.readyForFailure");
fluid.defaults("gpii.tests.templateFormControl.readyForFailure", {
    gradeNames: ["gpii.tests.templateFormControl", "autoInit"],
    ajaxOptions: {
        url: "/error"
    },
    model: {
        buttonName: "Fail"
    },
    templates: {
        initial: "form-failure-initial"
    }
});

fluid.registerNamespace("gpii.tests.templateFormControl.readyForStringifyFailure");
fluid.defaults("gpii.tests.templateFormControl.readyForStringifyFailure", {
    gradeNames: ["gpii.tests.templateFormControl", "autoInit"],
    ajaxOptions: {
        url: "/errorJsonString"
    },
    model: {
        buttonName: "Stringify Fail"
    },
    templates: {
        initial: "form-failure-initial"
    }
});

fluid.registerNamespace("gpii.tests.templateFormControl.readyForStringFailure");
fluid.defaults("gpii.tests.templateFormControl.readyForStringFailure", {
    gradeNames: ["gpii.tests.templateFormControl", "autoInit"],
    ajaxOptions: {
        url: "/errorString"
    },
    model: {
        buttonName: "String Fail"
    },
    rules: {
        error: {
            ok:           false,
            errorMessage: ""
        }
    },
    templates: {
        initial: "form-failure-initial"
    }
});

fluid.registerNamespace("gpii.tests.templateFormControl.readyForAmbiguity");
fluid.defaults("gpii.tests.templateFormControl.readyForAmbiguity", {
    gradeNames: ["gpii.tests.templateFormControl", "autoInit"],
    ajaxOptions: {
        url: "/content/json/error.json" // An error, delivered with a 200 status code.
    },
    model: {
        buttonName: "Dither"
    },
    templates: {
        initial: "form-ambiguous-initial",
        error:   "form-ambiguous-error"
    }
});


fluid.registerNamespace("gpii.tests.templateFormControl.readyForKeys");
fluid.defaults("gpii.tests.templateFormControl.readyForKeys", {
    gradeNames:    ["gpii.tests.templateFormControl", "autoInit"],
    hideOnSuccess: false,
    ajaxOptions: {
        url: "/content/json/success.json"
    },
    templates: {
        initial: "form-keyed-initial"
    }
});