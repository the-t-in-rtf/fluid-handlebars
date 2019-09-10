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

    gpii.tests.handlebars.browser.templateFormControl.runner.runTests = function (testRunner) {
        jqUnit.module("Testing the `templateFormControl` client-side grade.");

        fluid.each(testRunner.options.testDefs, function (singleTestDef) {
            jqUnit.asyncTest(singleTestDef.message, function () {
                var initialStateTestFn = function (componentToTest) {
                    jqUnit.start();

                    // Check the initial rendered state of the whole page for any components that failed to render.
                    gpii.test.handlebars.browser.sanityCheckElements([componentToTest.locate("initial")], [testRunner.options.matchDefs.initialState]);

                    jqUnit.stop();

                    // Wait for the form submission and refresh.  We use a timeout to avoid having to specify which
                    // sub-component's render to wait for or which model change to wait for (programatically listening for changes to "*" fires twice).
                    setTimeout(function () {
                        jqUnit.start();

                        // Inspect the results once the form is submitted.
                        if (componentToTest.options.submitResultMatchDef) {
                            gpii.test.handlebars.browser.sanityCheckElements([componentToTest.locate("initial")], [componentToTest.options.submitResultMatchDef]);
                        }
                        if (componentToTest.options.expectedModel) {
                            jqUnit.assertLeftHand("The model should be as expected after the form is submitted.", componentToTest.options.expectedModel, componentToTest.model);
                        }
                    }, 500);

                    componentToTest.submitForm();
                };

                try {
                    // Initialise the component.
                    var componentToTest = fluid.invokeGlobalFunction(singleTestDef.type, [
                        singleTestDef.container,
                        {
                            listeners: {
                                "onMarkupRendered.test": {
                                    func: initialStateTestFn,
                                    args: componentToTest
                                }
                            }
                        }
                    ]);
                }
                catch (error) {
                    jqUnit.start();
                    console.log(JSON.stringify(error, null, 2));
                    jqUnit.fail("There should be no errors creating the component.");
                }
            });
        });
    };

    fluid.defaults("gpii.tests.handlebars.browser.templateFormControl.runner", {
        gradeNames: ["fluid.component"],
        matchDefs: {
            initialState: {
                message: "The body should contain rendered content that replaces the original source.",
                pattern: "This content should not be visible",
                invert: true
            }
        },
        testDefs: {
            failure: {
                message: "Testing JSON failure.",
                type: "gpii.tests.templateFormControl.readyForFailure",
                container: ".readyForFailure"
            },
            stringifyFailure: {
                message: "Testing stringified JSON failure.",
                type: "gpii.tests.templateFormControl.readyForStringifyFailure",
                container: ".readyForStringifyFailure"
            },
            stringFailure: {
                message: "Testing string failure.",
                type: "gpii.tests.templateFormControl.readyForStringFailure",
                container: ".readyForStringFailure"
            },
            success: {
                message: "Testing JSON success.",
                type: "gpii.tests.templateFormControl.readyForSuccess",
                container: ".readyForSuccess"
            },
            successString: {
                message: "Testing string success.",
                type: "gpii.tests.templateFormControl.readyForStringSuccess",
                container: ".readyForStringSuccess"
            },
            successStringify: {
                message: "Testing stringified JSON success.",
                type: "gpii.tests.templateFormControl.readyForStringifySuccess",
                container: ".readyForStringifySuccess"
            }
        },
        listeners: {
            "onCreate.runTests": {
                func: "gpii.tests.handlebars.browser.templateFormControl.runner.runTests",
                args: ["{that}"]
            }
        }
    });

    /* eslint-disable no-unused-vars */
    gpii.tests.handlebars.browser.templateFormControl.runner();
})(fluid, jqUnit);
