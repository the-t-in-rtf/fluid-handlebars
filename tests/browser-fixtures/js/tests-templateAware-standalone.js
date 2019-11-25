/* eslint-env browser */
(function (fluid) {
    "use strict";
    fluid.registerNamespace("gpii.tests.handlebars.templateAware.standalone");

    fluid.defaults("gpii.tests.handlebars.templateAware.standalone", {
        gradeNames: ["fluid.modelComponent", "gpii.handlebars.templateAware.standalone"],
        selectors: {
            viewport: ""
        },
        mergePolicy: {
            templates: "noexpand"
        },
        templates: {
            layouts: {
                main: "{{body}}"
            },
            pages: {
                main: "This is our {{payload}} template content."
            }
        },
        model: {
            templates: "{that}.options.templates"
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: ["viewport", "main", { payload: "rendered" }, "html"] // selector, template, data, manipulator
            }
        }
    });

    fluid.defaults("gpii.tests.handlebars.templateAware.standalone.caseHolder", {
        gradeNames: ["fluid.test.testCaseHolder"],
        matchDefs: {
            markdown: {
                message: "The view should contain rendered content.",
                pattern: "This is our rendered template content."
            }
        },
        modules: [{
            name: "Testing the standalone `templateAware` grade.",
            tests: [{
                name: "Confirm that the view contains rendered content (including variable data).",
                sequence: [
                    {
                        func: "{testEnvironment}.events.createFixtures.fire"
                    },
                    {
                        event: "{testEnvironment}.events.onMarkupRendered",
                        listener: "gpii.test.handlebars.browser.sanityCheckSelectors",
                        args: [".templateAware-standalone-viewport", "{that}.options.matchDefs"]
                    }
                ]
            }]
        }]
    });

    fluid.defaults("gpii.tests.handlebars.templateAware.standalone.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        events: {
            createFixtures: null,
            onMarkupRendered: null
        },
        components: {
            caseHolder: {
                type: "gpii.tests.handlebars.templateAware.standalone.caseHolder"
            },
            viewComponent: {
                type: "gpii.tests.handlebars.templateAware.standalone",
                container: ".templateAware-standalone-viewport",
                createOnEvent: "createFixtures",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.handlebars.templateAware.standalone.testEnvironment}.events.onMarkupRendered.fire"
                        }
                    }
                }
            }
        }
    });

    fluid.test.runTests("gpii.tests.handlebars.templateAware.standalone.testEnvironment");
})(fluid);
