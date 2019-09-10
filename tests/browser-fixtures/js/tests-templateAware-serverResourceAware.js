// Test the base "template aware" component.
/* eslint-env browser */
/* globals jqUnit */
(function (fluid, jqUnit) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    // Test components to render content.
    fluid.defaults("gpii.tests.templateAware.serverResourceAware", {
        gradeNames: ["gpii.tests.handlebars.templateAware.serverResourceAware"],
        template:   "index",
        selectors: {
            initial: "" // Update the whole container
        },
        model: {
            myvar:    "modelvariable",
            markdown: "*this works*",
            json:     { foo: "bar", baz: "quux", qux: "quux" }
        },
        invokers: {
            renderInitialMarkup: {
                func: "{that}.renderMarkup",
                args: [ "initial", "{that}.options.template", "{that}.model", "html"] // selector, template, data, manipulator
            }
        }
    });

    fluid.defaults("gpii.tests.templateAware.contained", {
        gradeNames: ["gpii.tests.templateAware.serverResourceAware"],
        template:  "form-contained-initial",
        selectors: {
            initial: ".contained-inner" // Update an interior element without disturbing the root container.
        }
    });

    fluid.registerNamespace("gpii.tests.templateAware.runner");

    gpii.tests.templateAware.runner.runTests = function (that) {
        jqUnit.module("Testing the `templateAware` client side grade.");

        jqUnit.test("Confirm that the templateAware component is rendered correctly.", function () {
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport", that.options.matchDefs.standard);

            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport", that.options.matchDefs.originalContent);

            gpii.test.handlebars.browser.sanityCheckSelectors(".contained", that.options.matchDefs.contained);
        });
    };

    fluid.defaults("gpii.tests.templateAware.runner", {
        gradeNames: ["fluid.viewComponent"],
        events: {
            mainRendered: null,
            containedRendered: null,
            allRendered: {
                events: {
                    mainRendered: "mainRendered",
                    containedRendered: "containedRendered"
                }
            }
        },
        matchDefs: {
            contained: {
                outside: {
                    message: "Content outside of the inner container should not have been disturbed...",
                    pattern: "This content should not be overwritten."
                },
                inside: {
                    message: "The original content of the inner container should have been updated...",
                    pattern: "A place for everything, and everything in its place."
                }
            }
        },
        selectors: {
            main: ".viewport",
            contained: ".contained"
        },
        components: {
            main: {
                type: "gpii.tests.templateAware.serverResourceAware",
                container: "{that}.dom.main",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.templateAware.runner}.events.mainRendered.fire"
                        }
                    }
                }
            },
            contained: {
                type: "gpii.tests.templateAware.contained",
                container: "{that}.dom.contained",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.templateAware.runner}.events.containedRendered.fire"
                        }
                    }
                }
            }
        },
        listeners: {
            "allRendered.runTests": {
                funcName: "gpii.tests.templateAware.runner.runTests",
                args: ["{that}"]
            }
        }
    });

    gpii.tests.templateAware.runner("body");
})(fluid, jqUnit);
