/* eslint-env browser */
(function (fluid) {
    "use strict";
    // Test rendering functions independently of the `templateAware` rendering infrastructure.
    //
    // This is a test component that is meant to be included in a client-side document.
    fluid.registerNamespace("fluid.tests.handlebars.renderer.serverResourceAware");

    fluid.tests.handlebars.renderer.serverResourceAware.renderBlock = function (that, rendererFn, selector, templateName) {
        templateName = templateName || that.options.templateName;
        that.renderer[rendererFn](that.locate(selector), templateName, that.model);
        that.events.onMarkupRendered.fire();
    };

    // common sequences to ensure the component is actually ready to render for each run of tests.
    fluid.defaults("fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.startSequence", {
        gradeNames: "fluid.test.sequenceElement",
        sequence: [
            { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
                func: "{testEnvironment}.events.constructFixtures.fire"
            },
            {
                listener: "fluid.identity",
                event: "{testEnvironment}.events.onFixturesConstructed"
            }
        ]
    });

    fluid.defaults("fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.stopSequence", {
        gradeNames: "fluid.test.sequenceElement",
        sequence: [{
            func: "{testEnvironment}.destroyViewComponent"
        }]
    });

    fluid.defaults("fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.sequenceGrade", {
        gradeNames: ["fluid.test.sequence"],
        sequenceElements: {
            startFixtures: {
                gradeNames: "fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.startSequence",
                priority: "before:sequence"
            },
            stopFixtures: {
                gradeNames: "fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.stopSequence",
                priority: "after:sequence"
            }
        }
    });

    fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.getPreviousSibling = function () {
        return $(".viewport-before").prev();
    };

    fluid.defaults("fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder", {
        gradeNames: ["fluid.test.testCaseHolder"],
        replaceWithTemplateName: "replace",
        modules: [{
            name: "Tests for 'server resource aware' renderer.",
            tests: [
                {
                    name: "Confirm that the client-side renderer can add content after an existing element.",
                    sequenceGrade: "fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.sequenceGrade",
                    sequence: [
                        {
                            func: "fluid.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{testEnvironment}.viewComponent", "after", "viewport-after"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{testEnvironment}.events.onMarkupRendered",
                            listener: "fluid.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-after + *", fluid.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "fluid.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-after", fluid.test.handlebars.browser.matchDefs.originalContent] // selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Confirm that the client-side renderer can append content to an existing element.",
                    sequenceGrade: "fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.sequenceGrade",
                    sequence: [
                        {
                            func: "fluid.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{testEnvironment}.viewComponent", "append", "viewport-append"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{testEnvironment}.events.onMarkupRendered",
                            listener: "fluid.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-append", fluid.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "fluid.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-append", fluid.test.handlebars.browser.matchDefs.originalContentAtBeginning] // selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Confirm that the client-side renderer can add content before an existing element.",
                    sequenceGrade: "fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.sequenceGrade",
                    sequence: [
                        {
                            func: "fluid.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{testEnvironment}.viewComponent", "before", "viewport-before"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{testEnvironment}.events.onMarkupRendered",
                            listener: "fluid.test.handlebars.browser.sanityCheckElements",
                            args: ["@expand:fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.getPreviousSibling()", fluid.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "fluid.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-before", fluid.test.handlebars.browser.matchDefs.originalContentAtBeginning] // selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Confirm that the client-side renderer can replace existing html content in an element.",
                    sequenceGrade: "fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.sequenceGrade",
                    sequence: [
                        {
                            func: "fluid.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{testEnvironment}.viewComponent", "html", "viewport-html"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{testEnvironment}.events.onMarkupRendered",
                            listener: "fluid.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-html", fluid.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "fluid.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-html", fluid.test.handlebars.browser.matchDefs.noOriginalContent] // selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Confirm that the client-side renderer can prepend content to an existing element.",
                    sequenceGrade: "fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.sequenceGrade",
                    sequence: [
                        {
                            func: "fluid.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{testEnvironment}.viewComponent", "prepend", "viewport-prepend"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{testEnvironment}.events.onMarkupRendered",
                            listener: "fluid.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-prepend", fluid.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "fluid.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-prepend", fluid.test.handlebars.browser.matchDefs.originalContentAtEnd] // selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Confirm that the client-side renderer can replace an existing element altogether.",
                    sequenceGrade: "fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder.sequenceGrade",
                    sequence: [
                        {
                            func: "fluid.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{testEnvironment}.viewComponent", "replaceWith", "viewport-replaceWith", "{that}.options.replaceWithTemplateName"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{testEnvironment}.events.onMarkupRendered",
                            listener: "fluid.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-replaceWith.replaced", fluid.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "fluid.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-replaceWith.replaced", fluid.test.handlebars.browser.matchDefs.noOriginalContent] // selector, matchDefs
                        }
                    ]
                }
            ]
        }]
    });

    fluid.registerNamespace("fluid.tests.handlebars.renderer.serverResourceAware.testEnvironment");
    fluid.tests.handlebars.renderer.serverResourceAware.testEnvironment.destroyViewComponent = function (testEnvironment) {
        var viewComponent = fluid.get(testEnvironment, "viewComponent");
        if (viewComponent) {
            /*
                If I don't manually destroy the component and swallow the error, tests fail with errors like:

                `rec.event.removeListener is not a function`

             */
            // TODO: Discuss with Antranig.
            try {
                viewComponent.destroy();
            }
            catch (error) {
                fluid.log("Error destroying view component:", error);
            }
        }
    };

    fluid.defaults("fluid.tests.handlebars.renderer.serverResourceAware.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        events: {
            constructFixtures: null,
            onFixturesConstructed: null,
            onMarkupRendered: null
        },
        invokers: {
            destroyViewComponent: {
                funcName: "fluid.tests.handlebars.renderer.serverResourceAware.testEnvironment.destroyViewComponent",
                args: ["{that}"]
            }
        },
        components: {
            caseHolder: {
                type: "fluid.tests.handlebars.renderer.serverResourceAware.testCaseHolder"
            },
            viewComponent: {
                type: "fluid.tests.handlebars.templateAware.serverResourceAware",
                createOnEvent: "{testEnvironment}.events.constructFixtures",
                container: "body",
                options: {
                    model: {
                        myvar:    "modelvariable",
                        markdown: "*this works*",
                        json:     { foo: "bar", baz: "quux", qux: "quux" }
                    },
                    templateName:            "index",
                    selectors: {
                        "viewport-after":       ".viewport-after",
                        "viewport-append":      ".viewport-append",
                        "viewport-before":      ".viewport-before",
                        "viewport-html":        ".viewport-html",
                        "viewport-prepend":     ".viewport-prepend",
                        "viewport-replaceWith": ".viewport-replaceWith"
                    },
                    invokers: {
                        "renderInitialMarkup": {
                            funcName: "fluid.identity"
                        }
                    },
                    listeners: {
                        "onRendererAvailable.notifyParent": {
                            func: "{testEnvironment}.events.onFixturesConstructed.fire"
                        },
                        "onMarkupRendered.notifyParent": {
                            func: "{testEnvironment}.events.onMarkupRendered.fire"
                        }
                    }
                }
            }
        }
    });

    fluid.test.runTests("fluid.tests.handlebars.renderer.serverResourceAware.testEnvironment");
})(fluid);
