// Test all "template aware" components.
/* eslint-env browser */
/* globals jqUnit */
(function (fluid, jqUnit) {
    "use strict";
    fluid.defaults("fluid.tests.templateFormControl", {
        gradeNames: ["fluid.handlebars.templateFormControl"],
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

    fluid.defaults("fluid.tests.templateFormControl.readyForSuccess", {
        gradeNames: ["fluid.tests.templateFormControl"],
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

    fluid.defaults("fluid.tests.templateFormControl.readyForStringifySuccess", {
        gradeNames: ["fluid.tests.templateFormControl.readyForSuccess"],
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

    fluid.defaults("fluid.tests.templateFormControl.readyForStringSuccess", {
        gradeNames: ["fluid.tests.templateFormControl.readyForSuccess"],
        ajaxOptions: {
            url:      "./data/stringSuccess.txt",
            dataType: "text"
        },
        rules: {
            successResponseToModel: {
                isError:        true,
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

    fluid.defaults("fluid.tests.templateFormControl.readyForFailure", {
        gradeNames: ["fluid.tests.templateFormControl"],
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

    fluid.defaults("fluid.tests.templateFormControl.readyForStringifyFailure", {
        gradeNames: ["fluid.tests.templateFormControl"],
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

    fluid.defaults("fluid.tests.templateFormControl.readyForStringFailure", {
        gradeNames: ["fluid.tests.templateFormControl"],
        ajaxOptions: {
            url: "/errorString",
            dataType: "text"
        },
        model: {
            buttonName: "String Fail"
        },
        rules: {
            errorResponseToModel: {
                isError:      true,
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

    fluid.registerNamespace("fluid.tests.handlebars.browser.templateFormControl.runner");

    fluid.tests.handlebars.browser.templateFormControl.submitForm = function (componentToSubmit) {
        componentToSubmit.submitForm();
    };

    fluid.tests.handlebars.browser.templateFormControl.checkSubmitResults = function (componentToTest) {
        // Inspect the results once the form is submitted.
        if (componentToTest.options.submitResultMatchDef) {
            fluid.test.handlebars.browser.sanityCheckElements([componentToTest.locate("initial")], [componentToTest.options.submitResultMatchDef]);
        }
        if (componentToTest.options.expectedModel) {
            jqUnit.assertLeftHand("The model should be as expected after the form is submitted.", componentToTest.options.expectedModel, componentToTest.model);
        }
    };

    fluid.defaults("fluid.tests.handlebars.browser.templateFormControl.testCaseHolder", {
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
                            listener: "fluid.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{fluid.tests.templateFormControl.readyForFailure}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onFailureRequestReceived",
                            listener: "fluid.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{fluid.tests.templateFormControl.readyForFailure}"] // componentToTest
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
                            listener: "fluid.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{fluid.tests.templateFormControl.readyForStringifyFailure}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onStringifyFailureRequestReceived",
                            listener: "fluid.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{fluid.tests.templateFormControl.readyForStringifyFailure}"] // componentToTest
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
                            listener: "fluid.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{fluid.tests.templateFormControl.readyForStringFailure}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onStringFailureRequestReceived",
                            listener: "fluid.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{fluid.tests.templateFormControl.readyForStringFailure}"] // componentToTest
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
                            listener: "fluid.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{fluid.tests.templateFormControl.readyForSuccess}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onSuccessRequestReceived",
                            listener: "fluid.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{fluid.tests.templateFormControl.readyForSuccess}"] // componentToTest
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
                            listener: "fluid.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{fluid.tests.templateFormControl.readyForStringSuccess}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onSuccessStringRequestReceived",
                            listener: "fluid.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{fluid.tests.templateFormControl.readyForStringSuccess}"] // componentToTest
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
                            listener: "fluid.tests.handlebars.browser.templateFormControl.submitForm",
                            args: ["{fluid.tests.templateFormControl.readyForStringifySuccess}"] // componentToSubmit
                        },
                        {
                            event: "{testCaseHolder}.events.onSuccessStringifyRequestReceived",
                            listener: "fluid.tests.handlebars.browser.templateFormControl.checkSubmitResults",
                            args: ["{fluid.tests.templateFormControl.readyForStringifySuccess}"] // componentToTest
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
                type: "fluid.tests.templateFormControl.readyForFailure",
                container: ".readyForFailure",
                createOnEvent: "createFailureComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onFailureRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onFailureRequestReceived.fire"
                        }
                    }
                }
            },
            stringifyFailure: {
                type: "fluid.tests.templateFormControl.readyForStringifyFailure",
                container: ".readyForStringifyFailure",
                createOnEvent: "createStringifyFailureComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onStringifyFailureRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onStringifyFailureRequestReceived.fire"
                        }
                    }
                }
            },
            stringFailure: {
                type: "fluid.tests.templateFormControl.readyForStringFailure",
                container: ".readyForStringFailure",
                createOnEvent: "createStringFailureComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onStringFailureRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onStringFailureRequestReceived.fire"
                        }
                    }
                }
            },
            success: {
                type: "fluid.tests.templateFormControl.readyForSuccess",
                container: ".readyForSuccess",
                createOnEvent: "createSuccessComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessRequestReceived.fire"
                        }
                    }
                }
            },
            successString: {
                type: "fluid.tests.templateFormControl.readyForStringSuccess",
                container: ".readyForStringSuccess",
                createOnEvent: "createSuccessStringComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessStringRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessStringRequestReceived.fire"
                        }
                    }
                }
            },
            successStringify: {
                type: "fluid.tests.templateFormControl.readyForStringifySuccess",
                container: ".readyForStringifySuccess",
                createOnEvent: "createSuccessStringifyComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessStringifyRendered.fire"
                        },
                        "requestReceived.notifyParent": {
                            func: "{fluid.tests.handlebars.browser.templateFormControl.testCaseHolder}.events.onSuccessStringifyRequestReceived.fire"
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("fluid.tests.handlebars.browser.templateFormControl.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            caseHolder: {
                type: "fluid.tests.handlebars.browser.templateFormControl.testCaseHolder",
                container: "body"
            }
        }
    });

    fluid.test.runTests("fluid.tests.handlebars.browser.templateFormControl.testEnvironment");
})(fluid, jqUnit);
