/* eslint-env browser */
(function (fluid) {
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

    fluid.registerNamespace("gpii.tests.handlebars.templateMessage.caseHolder");

    gpii.tests.handlebars.templateMessage.caseHolder.checkViewComponent = function (viewComponent, selector, matchDefs) {
        var elementToCheck = viewComponent.locate(selector);
        gpii.test.handlebars.browser.sanityCheckElements(elementToCheck, matchDefs);
    };

    fluid.defaults("gpii.tests.handlebars.templateMessage.caseHolder", {
        gradeNames: ["fluid.test.testCaseHolder", "fluid.viewComponent"],
        selectors: {
            updated: ".viewport-updated",
            initialised: ".viewport-initialised"
        },
        events: {
            createInitialisedComponent: null,
            onInitialisedComponentRendered: null,
            onUpdatedComponentRendered: null
        },
        matchDefs: {
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
        },
        modules: [{
            name: "Testing 'Template Message' grade.",
            tests: [
                {
                    name: "Testing component initialisation.",
                    sequence: [
                        {
                            func: "{gpii.tests.handlebars.templateMessage.caseHolder}.events.createInitialisedComponent.fire"
                        },
                        {
                            event: "{gpii.tests.handlebars.templateMessage.caseHolder}.events.onInitialisedComponentRendered",
                            listener: "gpii.tests.handlebars.templateMessage.caseHolder.checkViewComponent",
                            args: ["{gpii.tests.handlebars.templateMessage.caseHolder}.initialised", "viewport", ["{gpii.tests.handlebars.templateMessage.caseHolder}.options.matchDefs.initialMarkupReplaced", "{gpii.tests.handlebars.templateMessage.caseHolder}.options.matchDefs.renderedMarkup"]] // viewComponent, selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Test component model relay.",
                    sequence: [
                        {
                            func: "{gpii.tests.handlebars.templateMessage.caseHolder}.updated.applier.change",
                            args: ["message", "Some are born with data, some achieve data, and some have data thrust upon them."]
                        },
                        {
                            event: "{that}.events.onUpdatedComponentRendered",
                            listener: "gpii.tests.handlebars.templateMessage.caseHolder.checkViewComponent",
                            args: ["{gpii.tests.handlebars.templateMessage.caseHolder}.updated", "viewport", ["{gpii.tests.handlebars.templateMessage.caseHolder}.options.matchDefs.initialMarkupReplaced", "{gpii.tests.handlebars.templateMessage.caseHolder}.options.matchDefs.updatedModelData"]] // viewComponent, selector, matchDefs
                        }
                    ]
                }
            ]
        }],
        components: {
            initialised: {
                type: "gpii.tests.handlebars.templateMessage.initialised",
                container: "{gpii.tests.handlebars.templateMessage.caseHolder}.dom.initialised",
                createOnEvent: "{gpii.tests.handlebars.templateMessage.caseHolder}.events.createInitialisedComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.handlebars.templateMessage.caseHolder}.events.onInitialisedComponentRendered.fire"
                        }
                    }
                }
            },
            updated: {
                type: "gpii.tests.handlebars.templateMessage",
                container: "{gpii.tests.handlebars.templateMessage.caseHolder}.dom.updated",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{gpii.tests.handlebars.templateMessage.caseHolder}.events.onUpdatedComponentRendered.fire"
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("gpii.tests.handlebars.templateMessage.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            caseHolder: {
                type: "gpii.tests.handlebars.templateMessage.caseHolder",
                container: "body"
            }
        }
    });

    fluid.test.runTests("gpii.tests.handlebars.templateMessage.testEnvironment");
})(fluid);
