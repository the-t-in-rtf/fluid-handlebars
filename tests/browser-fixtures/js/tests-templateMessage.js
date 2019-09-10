/* eslint-env browser */
/* globals jqUnit */
(function (fluid, jqUnit) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    // Test the "template message" component.
    fluid.defaults("gpii.tests.handlebars.templateMessage", {
        gradeNames: ["gpii.handlebars.templateAware.standalone", "gpii.handlebars.templateMessage"],
        model: {
            templates: {
                pages: {
                    "common-message": "<div class=\"callout\">{{message}}</div>"
                }
            }
        }
    });

    fluid.defaults("gpii.tests.handlebars.templateMessage.initialised", {
        gradeNames: ["gpii.tests.handlebars.templateMessage"],
        model: {
            message: "I was born with silver model data in my mouth."
        }
    });

    fluid.registerNamespace("gpii.tests.handlebars.templateMessage");
    gpii.tests.handlebars.templateMessage.matchDefs = {
        initialMarkupReplaced: {
            message: "The initial markup should no longer be present...",
            pattern: "should not be visible",
            invert: true
        },
        renderedMarkup: {
            message: "There should be rendered content",
            pattern: "born with silver model data in my mouth"
        },
        updatedModelData: {
            message: "There should be updated model content...",
            pattern: "some have data thrust upon them"
        }
    };

    jqUnit.module("Testing 'Template Message' grade.");

    jqUnit.test("Testing component initialisation.", function () {
        var initialisedComponent = gpii.tests.handlebars.templateMessage.initialised(".viewport-initialised");
        gpii.test.handlebars.browser.sanityCheckElements(initialisedComponent.locate("viewport"), [gpii.tests.handlebars.templateMessage.matchDefs.initialMarkupReplaced, gpii.tests.handlebars.templateMessage.matchDefs.renderedMarkup]);
    });

    jqUnit.test("Test component model relay.", function () {
        var updatedComponent = gpii.tests.handlebars.templateMessage(".viewport-updated");
        updatedComponent.applier.change("message", "Some are born with data, some achieve data, and some have data thrust upon them.");
        gpii.test.handlebars.browser.sanityCheckElements(updatedComponent.locate("viewport"), [gpii.tests.handlebars.templateMessage.matchDefs.initialMarkupReplaced, gpii.tests.handlebars.templateMessage.matchDefs.updatedModelData]);
    });
})(fluid, jqUnit);
