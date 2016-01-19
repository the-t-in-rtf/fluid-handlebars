// Test "template aware" client-side components using `gpii-test-browser`.
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.defaults("gpii.templates.tests.browser.templateAware.caseHolder", {
    gradeNames: ["gpii.templates.tests.browser.caseHolder"],
    rawModules: [{
        tests: [
            {
                name: "Confirm that the templateAware component is rendered...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event: "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.getElementHtml, ".viewport", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport", "{gpii.templates.tests.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.equalThingsAreTrue, ".viewport"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.unequalThingsAreFalse, ".viewport"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport", "{gpii.templates.tests.browser.environment}.options.patterns.originalContent"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:     ["The original content should no longer be found...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".contained", "This content should not be overwritten."]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Content outside of the inner container should not have been disturbed...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".contained", "A place for everything, and everything in its place."]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The original content of the inner container should have been updated...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.templates.tests.browser.environment({
    "port": 6895,
    "path": "content/tests-templateAware.html",
    expected: {
        myvar:    "modelvariable",
        markdown: "*this works*",
        json:     { foo: "bar", baz: "quux", qux: "quux" }
    },
    patterns: {
        originalContent:  "This content should not be visible",
        renderedMarkdown: "<p><em>this works<\/em><\/p>",
        variable:         "modelvariable"
    },
    components: {
        caseHolder: {
            type: "gpii.templates.tests.browser.templateAware.caseHolder"
        }
    }
});