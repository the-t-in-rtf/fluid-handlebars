// Test all "template aware" components.
/* eslint-env browser */
/* globals jqUnit */
(function (fluid, jqUnit) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.defaults("gpii.tests.templateFormControl", {
        gradeNames: ["gpii.handlebars.templateFormControl"],
        templateKeys: {
            success: "common-success",
            error:   "common-error"
        },
        mergePolicy: {
            expectedModel: "nomerge"
        },
        submitResultMatchDef: {
            message: "The updated HTML should be as expected."
        },
        rules: {
            successResponseToModel: {
                successMessage: { literalValue: "The response was successful." }
            },
            errorResponseToModel: {
                errorMessage: { literalValue: "The response was not successful." }
            }
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForSuccess", {
        gradeNames: ["gpii.tests.templateFormControl"],
        ajaxOptions: {
            url:    "./data/success.json",
            dataType: "json"
        },
        model: {
            buttonName: "Succeed"
        },
        templateKeys: {
            initial: "form-success-initial",
            success: "form-success"
        },
        submitResultMatchDef: {
            message: "The updated HTML should be as expected.",
            pattern: "This was a triumph",
            selector: ".templateFormControl-success"
        },
        expectedModel: {
            record: {
                foo: "bar",
                baz: "qux"
            }
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForStringifySuccess", {
        gradeNames: ["gpii.tests.templateFormControl.readyForSuccess"],
        ajaxOptions: {
            url:      "./data/stringifySuccess.txt",
            dataType: "json"
        },
        model: {
            buttonName: "Stringify Succeed"
        },
        submitResultMatchDef: {
            message:  "The updated HTML should be as expected.",
            selector: ".templateFormControl-success",
            pattern:  "This was a triumph"
        },
        expectedModel: {
            record: {
                foo: "bar",
                baz: "qux"
            }
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForStringSuccess", {
        gradeNames: ["gpii.tests.templateFormControl.readyForSuccess"],
        ajaxOptions: {
            url:      "./data/stringSuccess.txt",
            dataType: "text"
        },
        rules: {
            successResponseToModel: {
                ok:             false,
                successMessage: "responseText"
            }
        },
        model: {
            buttonName: "String Succeed"
        },
        submitResultMatchDef: {
            pattern:  "This was a triumph",
            selector: ".templateFormControl-success"
        },
        expectedModel: {
            successMessage: "A success string is still a success."
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForFailure", {
        gradeNames: ["gpii.tests.templateFormControl"],
        ajaxOptions: {
            url: "/error"
        },
        model: {
            buttonName: "Fail"
        },
        templateKeys: {
            initial: "form-failure-initial"
        },
        submitResultMatchDef: {
            selector: ".templateFormControl-error",
            pattern:  "The response was not successful."
        },
        expectedModel: {
            errorMessage: "The response was not successful."
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForStringifyFailure", {
        gradeNames: ["gpii.tests.templateFormControl"],
        ajaxOptions: {
            url: "/errorJsonString"
        },
        model: {
            buttonName: "Stringify Fail"
        },
        templateKeys: {
            initial: "form-failure-initial"
        },
        submitResultMatchDef: {
            pattern:  "The response was not successful.",
            selector: ".templateFormControl-error"
        },
        expectedModel: {
            errorMessage: "The response was not successful."
        }
    });

    fluid.defaults("gpii.tests.templateFormControl.readyForStringFailure", {
        gradeNames: ["gpii.tests.templateFormControl"],
        ajaxOptions: {
            url: "/errorString",
            dataType: "text"
        },
        model: {
            buttonName: "String Fail"
        },
        rules: {
            errorResponseToModel: {
                ok:           false,
                errorMessage: "responseText"
            }
        },
        templateKeys: {
            initial: "form-failure-initial"
        },
        submitResultMatchDef: {
            pattern:  "There was a problem.",
            selector: ".templateFormControl-error"
        },
        expectedModel: {
            errorMessage: "There was a problem.  I'm telling you about it with a string response, hopefully this doesn't cause another problem."
        }
    });

    fluid.registerNamespace("gpii.tests.handlebars.browser.templateFormControl.runner");

    gpii.tests.handlebars.browser.templateFormControl.submitForm = function (componentToSubmit) {
        componentToSubmit.submitForm();
    };

    gpii.tests.handlebars.browser.templateFormControl.checkSubmitResults = function (componentToTest) {
        // Inspect the results once the form is submitted.
        if (componentToTest.options.submitResultMatchDef) {
            gpii.test.handlebars.browser.sanityCheckElements([componentToTest.locate("initial")], [componentToTest.options.submitResultMatchDef]);
        }
        if (componentToTest.options.expectedModel) {
            jqUnit.assertLeftHand("The model should be as expected after the form is submitted.", componentToTest.options.expectedModel, componentToTest.model);
        }
    };

    fluid.defaults("gpii.tests.handlebars.browser.templateFormControl.testCaseHolder", {
        gradeNames: ["fluid.test.testCaseHolder"],
        matchDefs: {
            initialState: {
                message: "The body should contain rendered content that replaces the original source.",
                pattern: "This content should not be visible",
                invert: true
            }
        },
        modules: [{
            name: "Testing the `templateFormControl` client-side grade.",
            tests: [
                {
                    name: "Testing JSON failure.",
                    sequence: [
                        {
                            func: "{testCaseHolder}.events.createFailureComponent.fire"
                        },
                        {
                            event: "{testCaseHolder}.events.onFailureRendered",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{gpii.tests.templateFormControl.readyForFailure}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onFailureRequestReceived",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{gpii.tests.templateFormControl.readyForFailure}"] // componentToTest
                        }
                    ]
                },
                {
                    name: "Testing stringified JSON failure.",
                    sequence: [
                        {
                            func: "{testCaseHolder}.events.createStringifyFailureComponent.fire"
                        },
                        {
                            event: "{testCaseHolder}.events.onStringifyFailureRendered",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{gpii.tests.templateFormControl.readyForStringifyFailure}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onStringifyFailureRequestReceived",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{gpii.tests.templateFormControl.readyForStringifyFailure}"] // componentToTest
                        }
                    ]
                },
                {
                    name: "Testing string failure.",
                    sequence: [
                        {
                            func: "{testCaseHolder}.events.createStringFailureComponent.fire"
                        },
                        {
                            event: "{testCaseHolder}.events.onStringFailureRendered",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{gpii.tests.templateFormControl.readyForStringFailure}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onStringFailureRequestReceived",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{gpii.tests.templateFormControl.readyForStringFailure}"] // componentToTest
                        }
                    ]
                },
                {
                    name: "Testing JSON success.",
                    sequence: [
                        {
                            func: "{testCaseHolder}.events.createSuccessComponent.fire"
                        },
                        {
                            event: "{testCaseHolder}.events.onSuccessRendered",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{gpii.tests.templateFormControl.readyForSuccess}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onSuccessRequestReceived",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{gpii.tests.templateFormControl.readyForSuccess}"] // componentToTest
                        }
                    ]
                },
                {
                    name: "Testing string success.",
                    sequence: [
                        {
                            func: "{testCaseHolder}.events.createSuccessStringComponent.fire"
                        },
                        {
                            event: "{testCaseHolder}.events.onSuccessStringRendered",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{gpii.tests.templateFormControl.readyForStringSuccess}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onSuccessStringRequestReceived",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{gpii.tests.templateFormControl.readyForStringSuccess}"] // componentToTest
                        }
                    ]
                },
                {
                    name: "Testing stringified JSON success.",
                    sequence: [
                        {
                            func: "{testCaseHolder}.events.createSuccessStringifyComponent.fire"
                        },
                        {
                            event: "{testCaseHolder}.events.onSuccessStringifyRendered",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{gpii.tests.templateFormControl.readyForStringifySuccess}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onSuccessStringifyRequestReceived",
                            listener: "gpii.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{gpii.tests.templateFormControl.readyForStringifySuccess}"] // componentToTest
                        }
                    ]
                }
            ]
        }],
        events: {
            createFailureComponent: null,
            onFailureRendered:  null,
            onFailureRequestReceived: null,

            createStringifyFailureComponent: null,
            onStringifyFailureRendered:  null,
            onStringifyFailureRequestReceived: null,

            createStringFailureComponent: null,
            onStringFailureRendered:  null,
            onStringFailureRequestReceived: null,

            createSuccessComponent: null,
            onSuccessRendered:  null,
            onSuccessRequestReceived: null,

            createSuccessStringComponent: null,
            onSuccessStringRendered:  null,
            onSuccessStringRequestReceived: null,

            createSuccessStringifyComponent: null,
            onSuccessStringifyRendered:  null,
            onSuccessStringifyRequestReceived: null
        },
        components: {
            failure: {
                type: "gpii.tests.templateFormControl.readyForFailure",
                container: ".readyForFailure",
                createOnEvent: "createFailureComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onFailureRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onFailureRequestReceived.fire"
                        }
                    }
                }
            },
            stringifyFailure: {
                type: "gpii.tests.templateFormControl.readyForStringifyFailure",
                container: ".readyForStringifyFailure",
                createOnEvent: "createStringifyFailureComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onStringifyFailureRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onStringifyFailureRequestReceived.fire"
                        }
                    }
                }
            },
            stringFailure: {
                type: "gpii.tests.templateFormControl.readyForStringFailure",
                container: ".readyForStringFailure",
                createOnEvent: "createStringFailureComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onStringFailureRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onStringFailureRequestReceived.fire"
                        }
                    }
                }
            },
            success: {
                type: "gpii.tests.templateFormControl.readyForSuccess",
                container: ".readyForSuccess",
                createOnEvent: "createSuccessComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessRequestReceived.fire"
                        }
                    }
                }
            },
            successString: {
                type: "gpii.tests.templateFormControl.readyForStringSuccess",
                container: ".readyForStringSuccess",
                createOnEvent: "createSuccessStringComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessStringRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessStringRequestReceived.fire"
                        }
                    }
                }
            },
            successStringify: {
                type: "gpii.tests.templateFormControl.readyForStringifySuccess",
                container: ".readyForStringifySuccess",
                createOnEvent: "createSuccessStringifyComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessStringifyRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{gpii.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessStringifyRequestReceived.fire"
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("gpii.tests.handlebars.browser.templateFormControl.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            caseHolder: {
                type: "gpii.tests.handlebars.browser.templateFormControl.testCaseHolder",
                container: "body"
            }
        }
    });

    // TODO: Figure out why this causes the test run to never leave the "running" state.
    //fluid.test.runTests("gpii.tests.handlebars.browser.templateFormControl.testEnvironment");
    gpii.tests.handlebars.browser.templateFormControl.testEnvironment();
})(fluid, jqUnit);
