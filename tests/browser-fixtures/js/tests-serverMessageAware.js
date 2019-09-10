/* globals jqUnit */
(function (fluid, jqUnit) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.tests.templateAware.serverMessageAware");

    gpii.tests.templateAware.serverMessageAware.runTests = function (that) {
        jqUnit.module("Testing rendering of i18n messages using serverMessageAware grade.");
        jqUnit.test("Confirm that the serverMessageAware grade can render internationalised/localised content.", function () {
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport", that.options.matchDefs);
        });
    };

    // A test fixture to use in exercising the serverMessageAware grade.
    fluid.defaults("gpii.tests.templateAware.serverMessageAware", {
        gradeNames: ["gpii.tests.handlebars.templateAware.serverResourceAware"],
        template:   "serverMessageAware",
        selectors: {
            initial: "" // Update the whole container
        },
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
        },
        listeners: {
            "onMarkupRendered.runTests": {
                funcName: "gpii.tests.templateAware.serverMessageAware.runTests",
                args: ["{that}"]
            }
        }
    });

    gpii.tests.templateAware.serverMessageAware(".viewport");
})(fluid, jqUnit);
