/* eslint-env browser */
(function (fluid) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    // Test rendering functions independently of the `templateAware` rendering infrastructure.
    //
    // This is a test component that is meant to be included in a client-side document.
    fluid.registerNamespace("gpii.tests.handlebars.renderer.serverResourceAware");

    gpii.tests.handlebars.renderer.serverResourceAware.renderBlock = function (that, rendererFn, selector, templateName) {
        templateName = templateName || that.options.templateName;
        that.renderer[rendererFn](that.locate(selector), templateName, that.model);
        that.events.onMarkupRendered.fire();
    };

    fluid.registerNamespace("gpii.tests.handlebars.renderer.serverResourceAware.testCaseHolder");

    gpii.tests.handlebars.renderer.serverResourceAware.testCaseHolder.getPreviousSibling = function () {
        return $(".viewport-before").prev();
    };

    fluid.defaults("gpii.tests.handlebars.renderer.serverResourceAware.testCaseHolder", {
        gradeNames: ["fluid.test.testCaseHolder", "gpii.tests.handlebars.templateAware.serverResourceAware"],
        model: {
            myvar:    "modelvariable",
            markdown: "*this works*",
            json:     { foo: "bar", baz: "quux", qux: "quux" }
        },
        templateName:            "index",
        replaceWithTemplateName: "replace",
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
        modules: [{
            name: "Tests for 'server resource aware' renderer.",
            tests: [
                {
                    name: "Confirm that the client-side renderer can add content after an existing element.",
                    sequence: [
                        {
                            func: "gpii.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{that}", "after", "viewport-after"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{that}.events.onMarkupRendered",
                            listener: "gpii.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-after + *", gpii.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "gpii.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-after", gpii.test.handlebars.browser.matchDefs.originalContent] // selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Confirm that the client-side renderer can append content to an existing element.",
                    sequence: [
                        {
                            func: "gpii.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{that}", "append", "viewport-append"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{that}.events.onMarkupRendered",
                            listener: "gpii.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-append", gpii.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "gpii.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-append", gpii.test.handlebars.browser.matchDefs.originalContentAtBeginning] // selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Confirm that the client-side renderer can add content before an existing element.",
                    sequence: [
                        {
                            func: "gpii.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{that}", "before", "viewport-before"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{that}.events.onMarkupRendered",
                            listener: "gpii.test.handlebars.browser.sanityCheckElements",
                            args: ["@expand:gpii.tests.handlebars.renderer.serverResourceAware.testCaseHolder.getPreviousSibling()", gpii.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "gpii.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-before", gpii.test.handlebars.browser.matchDefs.originalContentAtBeginning] // selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Confirm that the client-side renderer can replace existing html content in an element.",
                    sequence: [
                        {
                            func: "gpii.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{that}", "html", "viewport-html"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{that}.events.onMarkupRendered",
                            listener: "gpii.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-html", gpii.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "gpii.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-html", gpii.test.handlebars.browser.matchDefs.noOriginalContent] // selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Confirm that the client-side renderer can prepend content to an existing element.",
                    sequence: [
                        {
                            func: "gpii.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{that}", "prepend", "viewport-prepend"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{that}.events.onMarkupRendered",
                            listener: "gpii.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-prepend", gpii.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "gpii.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-prepend", gpii.test.handlebars.browser.matchDefs.originalContentAtEnd] // selector, matchDefs
                        }
                    ]
                },
                {
                    name: "Confirm that the client-side renderer can replace an existing element altogether.",
                    sequence: [
                        {
                            func: "gpii.tests.handlebars.renderer.serverResourceAware.renderBlock",
                            args: ["{that}", "replaceWith", "viewport-replaceWith", "{that}.options.replaceWithTemplateName"] // that, rendererFn, selector, [templateName]
                        },
                        {
                            event: "{that}.events.onMarkupRendered",
                            listener: "gpii.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-replaceWith.replaced", gpii.test.handlebars.browser.matchDefs.standard] // selector, matchDefs
                        },
                        {
                            func: "gpii.test.handlebars.browser.sanityCheckSelectors",
                            args: [".viewport-replaceWith.replaced", gpii.test.handlebars.browser.matchDefs.noOriginalContent] // selector, matchDefs
                        }
                    ]
                }
            ]
        }]
    });

    fluid.defaults("gpii.tests.handlebars.renderer.serverResourceAware.testEnvironment", {
        gradeNames: ["fluid.test.testEnvironment"],
        components: {
            caseHolder: {
                type: "gpii.tests.handlebars.renderer.serverResourceAware.testCaseHolder",
                container: "body"
            }
        }
    });

    // TODO: Figure out why this causes the test run to never leave the "running" state.
    //fluid.test.runTests("gpii.tests.handlebars.renderer.serverResourceAware.testEnvironment");
    gpii.tests.handlebars.renderer.serverResourceAware.testEnvironment();
})(fluid);
