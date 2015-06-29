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

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForSuccess");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForSuccess", {
    gradeNames: ["gpii.hb.tests.templateFormControl", "autoInit"],
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

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForStringifySuccess");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForStringifySuccess", {
    gradeNames: ["gpii.hb.tests.templateFormControl.readyForSuccess", "autoInit"],
    ajaxOptions: {
        url:      "/content/stringifySuccess.txt",
        dataType: "json"
    },
    model: {
        buttonName: "Stringify Succeed"
    }
});

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForStringSuccess");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForStringSuccess", {
    gradeNames: ["gpii.hb.tests.templateFormControl.readyForSuccess", "autoInit"],
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

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForFailure");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForFailure", {
    gradeNames: ["gpii.hb.tests.templateFormControl", "autoInit"],
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

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForStringifyFailure");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForStringifyFailure", {
    gradeNames: ["gpii.hb.tests.templateFormControl", "autoInit"],
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

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForStringFailure");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForStringFailure", {
    gradeNames: ["gpii.hb.tests.templateFormControl", "autoInit"],
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

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForAmbiguity");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForAmbiguity", {
    gradeNames: ["gpii.hb.tests.templateFormControl", "autoInit"],
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


fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForKeys");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForKeys", {
    gradeNames:    ["gpii.hb.tests.templateFormControl", "autoInit"],
    hideOnSuccess: false,
    ajaxOptions: {
        url: "/content/json/success.json"
    },
    templates: {
        initial: "form-keyed-initial"
    }
});

fluid.registerNamespace("gpii.hb.tests.templateFormControl.readyForNested");
fluid.defaults("gpii.hb.tests.templateFormControl.readyForNested", {
    gradeNames:    ["gpii.templates.hb.client.templateFormControl.singleRenderer", "autoInit"],
    hideOnSuccess: true,
    ajaxOptions: {
        url: "/content/json/success.json"
    },
    model: {
        buttonName: "Outer"
    },
    selectors: {
        form:    ".outer-form",
        submit:  ".outer-submit",
        success: ".outer-success",
        error:   ".outer-error"
    },
    rules: {
        success: {
            successMessage: {
                literalValue: "I look successful at least on the outside."
            }
        }
    },
    components: {
        inner: {
            type:          "gpii.hb.tests.templateFormControl",
            container:     ".form-nested-nested",
            createOnEvent: "{readyForNested}.events.onMarkupRendered",
            options: {
                selectors: {
                    form:    ".inner-form",
                    submit:  ".inner-submit",
                    success: ".inner-success",
                    error:   ".inner-error"
                },
                templates: {
                    initial: "form-nested-nested"
                },
                model: {
                    buttonName: "Inner"
                },
                rules: {
                    success: {
                        successMessage: {
                            literalValue: "I feel successful on the inside."
                        }
                    }
                }
            }
        }
    },
    templates: {
        initial: "form-nested-initial"
    }
});