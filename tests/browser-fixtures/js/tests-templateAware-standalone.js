/* eslint-env browser */
(function (fluid) {
    "use strict";
    fluid.registerNamespace("fluid.tests.handlebars.templateAware.standalone");

    fluid.defaults("fluid.tests.handlebars.templateAware.standalone", {
        gradeNames: ["fluid.modelComponent", "fluid.handlebars.templateAware.standalone"],
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

    fluid.defaults("fluid.tests.handlebars.templateAware.standalone.caseHolder", {
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
                        listener: "fluid.test.handlebars.browser.sanityCheckSelectors",
                        args: [".templateAware-standalone-viewport", "{that}.options.matchDefs"]
                    }
                ]
            }]
        }]
    });

    fluid.defaults("fluid.tests.handlebars.templateAware.standalone.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        events: {
            createFixtures: null,
            onMarkupRendered: null
        },
        components: {
            caseHolder: {
                type: "fluid.tests.handlebars.templateAware.standalone.caseHolder"
            },
            viewComponent: {
                type: "fluid.tests.handlebars.templateAware.standalone",
                container: ".templateAware-standalone-viewport",
                createOnEvent: "createFixtures",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{fluid.tests.handlebars.templateAware.standalone.testEnvironment}.events.onMarkupRendered.fire"
                        }
                    }
                }
            }
        }
    });

    fluid.test.runTests("fluid.tests.handlebars.templateAware.standalone.testEnvironment");
})(fluid);
