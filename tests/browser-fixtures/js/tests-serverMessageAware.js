(function (fluid) {
    "use strict";
    fluid.registerNamespace("gpii.tests.templateAware.serverMessageAware");

    // A test fixture to use in exercising the serverMessageAware grade.
    fluid.defaults("gpii.tests.templateAware.serverMessageAware", {
        gradeNames: ["gpii.tests.handlebars.templateAware.serverResourceAware"],
        template:   "serverMessageAware",
        selectors: {
            initial: "" // Update the whole container
        },
        model: {
            condition: "working",
            deep: {
                condition: "better"
            }
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: [ "initial", "{that}.options.template", "{that}.model", "html"]
            }
        }
    });

    fluid.defaults("gpii.tests.templateAware.serverMessageAware.caseHolder", {
        gradeNames: ["fluid.test.testCaseHolder"],
        matchDefs: {
            howAreThings: {
                message: "A message that has been translated should match the 'en-GB' locale.",
                pattern: "Things are tolerable.",
                locator: {css: "#how-are-things"}
            },
            shallowVariable: {
                message: "The new element should contain rendered variable content.",
                pattern: "This is working.",
                locator: {css: "#shallow-variable"}
            },
            deepVariable: {
                message: "The element after the original should have rendered content.",
                pattern: "This is even better.",
                locator: {css: "#deep-variable"}
            },
            nonRootContext: {
                message: "We should be able to specify the context for variables.",
                pattern: "This is better.",
                locator: {css: "#non-root-context"}
            }
        },
        modules: [{
            name: "Testing rendering of i18n messages using serverMessageAware grade.",
            tests: [{
                name: "Confirm that the serverMessageAware grade can render internationalised/localised content.",
                sequence: [
                    {
                        func: "{testEnvironment}.events.createFixtures.fire"
                    },
                    {
                        event: "{testEnvironment}.events.onMarkupRendered",
                        listener: "gpii.test.handlebars.browser.sanityCheckSelectors",
                        args: [".viewport", "{that}.options.matchDefs"]
                    }
                ]
            }]
        }]
    });

    fluid.defaults("gpii.tests.templateAware.serverMessageAware.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        events: {
            createFixtures: null,
            onMarkupRendered: null
        },
        components: {
            caseHolder: {
                type: "gpii.tests.templateAware.serverMessageAware.caseHolder"
            },
            viewComponent: {
                type: "gpii.tests.templateAware.serverMessageAware",
                createOnEvent: "createFixtures",
                container: ".viewport",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.templateAware.serverMessageAware.testEnvironment}.events.onMarkupRendered.fire"
                        }
                    }
                }
            }
        }
    });

    fluid.test.runTests("gpii.tests.templateAware.serverMessageAware.testEnvironment");
})(fluid);
