// Test "inline" router from the other side, ensuring that templates are available, that inheritance, etc. works correctly.
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.registerNamespace("gpii.handlebars.tests.browser.inline");

gpii.handlebars.tests.browser.inline.hasTemplateDirs = function () {
    /* globals window */
    var templates = window.templateAware.renderer.templates;

    // Look for a missing key, if found, stop searching
    var hasAllTemplates = fluid.find(
        ["layouts", "pages", "partials"],
        function (key) {
            if (!templates[key] || Object.keys(templates[key]).length === 0) {
                return false;
            }
            return undefined;
        },
        true // The default if we don't find an example to the contrary.
    );

    return hasAllTemplates;
};

/* globals window */
gpii.handlebars.tests.browser.inline.preservesPrimaryPage = function () {
    return window.templateAware.renderer.templates.pages.overridden.indexOf("primary") !== -1;
};

gpii.handlebars.tests.browser.inline.preservesPrimaryPartial = function () {
    return window.templateAware.renderer.templates.partials["overridden-partial"].indexOf("primary") !== -1;
};

gpii.handlebars.tests.browser.inline.hasSecondaryPage = function () {
    return window.templateAware.renderer.templates.pages.secondary.length > 0;
};

gpii.handlebars.tests.browser.inline.hasSecondaryPartial = function () {
    return window.templateAware.renderer.templates.partials["secondary-partial"].length > 0;
};

fluid.defaults("gpii.handlebars.tests.browser.inline.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.withExpress"],
    rawModules: [{
        tests: [{
            name: "Confirm that template content delivered by the 'inline' router is correct and usable from a templateAware component...",
            sequence: [
                {
                    func: "{gpii.handlebars.tests.browser.environment}.browser.goto",
                    args: ["{gpii.handlebars.tests.browser.environment}.options.url"]
                },
                {
                    event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onLoaded",
                    listener: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                    args:     [gpii.test.browser.getGlobalValue, "templateAware"]
                },
                {
                    event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                    listener: "jqUnit.assertNotNull",
                    args:     ["There should be a global variable for the client-side component...", "{arguments}.0"]
                },
                {
                    func: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                    args: [gpii.test.browser.getGlobalValue, "templateAware.renderer"]
                },
                {
                    event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                    listener: "jqUnit.assertNotNull",
                    args:     ["The client side component should have a renderer...", "{arguments}.0"]
                },
                {
                    func: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                    args: [gpii.test.browser.getGlobalValue, "templateAware.renderer.templates"]
                },
                {
                    event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                    listener: "jqUnit.assertNotNull",
                    args:     ["The renderer should have templates...", "{arguments}.0"]
                },
                {
                    func: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                    args: [gpii.handlebars.tests.browser.inline.preservesPrimaryPage]
                },
                {
                    event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                    listener: "jqUnit.assertTrue",
                    args:     ["A page that exists in the both the secondary and primary directory should not have been overridden...", "{arguments}.0"]
                },
                {
                    func: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                    args: [gpii.handlebars.tests.browser.inline.preservesPrimaryPartial]
                },
                {
                    event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                    listener: "jqUnit.assertTrue",
                    args:     ["A partial that exists in the both the secondary and primary directory should not have been overridden...", "{arguments}.0"]
                },
                {
                    func: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                    args: [gpii.handlebars.tests.browser.inline.hasSecondaryPage]
                },
                {
                    event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                    listener: "jqUnit.assertTrue",
                    args:     ["A page that only exists in the secondary directory should be available...", "{arguments}.0"]
                },
                {
                    func: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                    args: [gpii.handlebars.tests.browser.inline.hasSecondaryPartial]
                },
                {
                    event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                    listener: "jqUnit.assertTrue",
                    args:     ["A partial that only exists in the secondary directory should be available...", "{arguments}.0"]
                }
            ]
        }]
    }]
});

gpii.handlebars.tests.browser.environment({
    "port": 6595,
    "path": "content/tests-templateAware.html",
    components: {
        caseHolder: {
            type: "gpii.handlebars.tests.browser.inline.caseHolder"
        }
    }
});