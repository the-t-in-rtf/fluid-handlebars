/* eslint-env browser */
/* globals jqUnit */
(function (fluid, jqUnit) {
    "use strict";
    var gpii = fluid.registerNamespace("gpii");

    // Test rendering functions independently of the `templateAware` rendering infrastructure.
    //
    // This is a test component that is meant to be included in a client-side document.
    fluid.registerNamespace("gpii.tests.handlebars.renderer.serverResourceAware");

    gpii.tests.handlebars.renderer.serverResourceAware.transformUsingTemplates = function (that) {
        that.renderer.after(that.locate("viewport-after"), that.options.templateName, that.model);
        that.renderer.append(that.locate("viewport-append"), that.options.templateName, that.model);
        that.renderer.before(that.locate("viewport-before"), that.options.templateName, that.model);
        that.renderer.html(that.locate("viewport-html"), that.options.templateName, that.model);
        that.renderer.prepend(that.locate("viewport-prepend"), that.options.templateName, that.model);
        that.renderer.replaceWith(that.locate("viewport-replaceWith"), that.options.replaceWithTemplateName, that.model);

        that.events.onMarkupRendered.fire();
    };

    gpii.tests.handlebars.renderer.serverResourceAware.testRenderedMarkup = function () {
        // gpii.test.handlebars.browser.matchDefs
        jqUnit.test("Confirm that the client-side renderer can add content after an existing element...", function () {
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport-after + *", gpii.test.handlebars.browser.matchDefs.standard);
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport-after", gpii.test.handlebars.browser.matchDefs.originalContent);
        });

        jqUnit.test("Confirm that the client-side renderer can append content to an existing element...", function () {
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport-append", gpii.test.handlebars.browser.matchDefs.standard);
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport-append", gpii.test.handlebars.browser.matchDefs.originalContentAtBeginning);
        });

        jqUnit.test("Confirm that the client-side renderer can add content before an existing element...", function () {
            var previousSibling = $(".viewport-before").prev();
            gpii.test.handlebars.browser.sanityCheckElements(previousSibling, gpii.test.handlebars.browser.matchDefs.standard);
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport-before", gpii.test.handlebars.browser.matchDefs.originalContentAtBeginning);
        });

        jqUnit.test("Confirm that the client-side renderer can replace existing html content in an element...", function () {
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport-html", gpii.test.handlebars.browser.matchDefs.standard);
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport-html", gpii.test.handlebars.browser.matchDefs.noOriginalContent);
        });

        jqUnit.test("Confirm that the client-side renderer can prepend content to an existing element...", function () {
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport-prepend", gpii.test.handlebars.browser.matchDefs.standard);
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport-prepend", gpii.test.handlebars.browser.matchDefs.originalContentAtEnd);
        });

        jqUnit.test("Confirm that the client-side renderer can replace an existing element altogether...", function () {
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport-replaceWith.replaced", gpii.test.handlebars.browser.matchDefs.standard);
            gpii.test.handlebars.browser.sanityCheckSelectors(".viewport-replaceWith.replaced", gpii.test.handlebars.browser.matchDefs.noOriginalContent);
        });
    };

    fluid.defaults("gpii.tests.handlebars.renderer.serverResourceAware", {
        gradeNames: ["gpii.tests.handlebars.templateAware.serverResourceAware"],
        model: {
            myvar:                   "modelvariable",
            markdown:                "*this works*",
            json:                    { foo: "bar", baz: "quux", qux: "quux" }
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
                funcName: "gpii.tests.handlebars.renderer.serverResourceAware.transformUsingTemplates",
                args:     ["{that}"]
            }
        },
        listeners: {
            "onRendererAvailable.render": {
                func: "{that}.renderInitialMarkup"
            },
            "onMarkupRendered.testRenderedMarkup": {
                funcName: "gpii.tests.handlebars.renderer.serverResourceAware.testRenderedMarkup",
                args: ["{that}"]
            }
        }
    });

    gpii.tests.handlebars.renderer.serverResourceAware("body");
})(fluid, jqUnit);
