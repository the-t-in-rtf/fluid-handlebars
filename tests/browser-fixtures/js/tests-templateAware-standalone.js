/* eslint-env browser */
/* globals jqUnit */
(function (fluid, jqUnit) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.tests.handlebars.templateAware.standalone");

    gpii.tests.handlebars.templateAware.standalone.runTests = function (that) {
        jqUnit.module("Testing the standalone `templateAware` grade...");
        jqUnit.test("Confirm that the view contains rendered content (including variable data).", function () {
            gpii.test.handlebars.browser.sanityCheckSelectors(".templateAware-standalone-viewport", that.options.matchDefs);
        });
    };

    fluid.defaults("gpii.tests.handlebars.templateAware.standalone", {
        gradeNames: ["fluid.modelComponent", "gpii.handlebars.templateAware.standalone"],
        matchDefs: {
            markdown: {
                message: "The view should contain rendered content.",
                pattern: "This is our rendered template content."
            }
        },
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
        },
        listeners: {
            "onMarkupRendered.runTests": {
                funcName: "gpii.tests.handlebars.templateAware.standalone.runTests",
                args: ["{that}"]
            }
        }
    });

    gpii.tests.handlebars.templateAware.standalone(".templateAware-standalone-viewport");
})(fluid, jqUnit);
