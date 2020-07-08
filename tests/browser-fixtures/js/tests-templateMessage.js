/* eslint-env browser */
(function (fluid) {
    "use strict";
    // Test the "template message" component.
    fluid.defaults("fluid.tests.handlebars.templateMessage", {
        gradeNames: ["fluid.handlebars.templateAware.standalone", "fluid.handlebars.templateMessage"],
        model: {
            templates: {
                pages: {
                    "common-message": "<div class=\"callout\">{{message}}</div>"
                }
            }
        }
    });

    fluid.defaults("fluid.tests.handlebars.templateMessage.initialised", {
        gradeNames: ["fluid.tests.handlebars.templateMessage"],
        model: {
            message: "I was born with silver model data in my mouth."
        }
    });

    fluid.registerNamespace("fluid.tests.handlebars.templateMessage.caseHolder");

    fluid.tests.handlebars.templateMessage.caseHolder.checkViewComponent = function (viewComponent, selector, matchDefs) {
        var elementToCheck = viewComponent.locate(selector);
        fluid.test.handlebars.browser.sanityCheckElements(elementToCheck, matchDefs);
    };

    fluid.defaults("fluid.tests.handlebars.templateMessage.caseHolder", {
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
                            func: "{fluid.tests.handlebars.templateMessage.caseHolder}.events.createInitialisedComponent.fire"
                        },
                        {
                            event: "{fluid.tests.handlebars.templateMessage.caseHolder}.events.onInitialisedComponentRendered",
                            listener: "fluid.tests.handlebars.templateMessage.caseHolder.checkViewComponent",
                            args: ["{fluid.tests.handlebars.templateMessage.caseHolder}.initialised", "viewport", ["{fluid.tests.handlebars.templateMessage.caseHolder}.options.matchDefs.initialMarkupReplaced", "{fluid.tests.handlebars.templateMessage.caseHolder}.options.matchDefs.renderedMarkup"]] // viewComponent, selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Test component model relay.",
                    sequence: [
                        {
                            func: "{fluid.tests.handlebars.templateMessage.caseHolder}.updated.applier.change",
                            args: ["message", "Some are born with data, some achieve data, and some have data thrust upon them."]
                        },
                        {
                            event: "{that}.events.onUpdatedComponentRendered",
                            listener: "fluid.tests.handlebars.templateMessage.caseHolder.checkViewComponent",
                            args: ["{fluid.tests.handlebars.templateMessage.caseHolder}.updated", "viewport", ["{fluid.tests.handlebars.templateMessage.caseHolder}.options.matchDefs.initialMarkupReplaced", "{fluid.tests.handlebars.templateMessage.caseHolder}.options.matchDefs.updatedModelData"]] // viewComponent, selector, matchDefs
                        }
                    ]
                }
            ]
        }],
        components: {
            initialised: {
                type: "fluid.tests.handlebars.templateMessage.initialised",
                container: "{fluid.tests.handlebars.templateMessage.caseHolder}.dom.initialised",
                createOnEvent: "{fluid.tests.handlebars.templateMessage.caseHolder}.events.createInitialisedComponent",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{fluid.tests.handlebars.templateMessage.caseHolder}.events.onInitialisedComponentRendered.fire"
                        }
                    }
                }
            },
            updated: {
                type: "fluid.tests.handlebars.templateMessage",
                container: "{fluid.tests.handlebars.templateMessage.caseHolder}.dom.updated",
                options: {
                    listeners: {
                        "onMarkupRendered.notifyParent": {
                            func: "{fluid.tests.handlebars.templateMessage.caseHolder}.events.onUpdatedComponentRendered.fire"
                        }
                    }
                }
            }
        }
    });

    fluid.defaults("fluid.tests.handlebars.templateMessage.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            caseHolder: {
                type: "fluid.tests.handlebars.templateMessage.caseHolder",
                container: "body"
            }
        }
    });

    fluid.test.runTests("fluid.tests.handlebars.templateMessage.testEnvironment");
})(fluid);
