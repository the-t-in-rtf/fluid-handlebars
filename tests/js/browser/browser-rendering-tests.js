// Test client-side rendering using `gpii-test-browser` (Atom Electron and Chromium).
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.defaults("gpii.tests.handlebars.browser.renderer.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.withExpress"],
    rawModules: [{
        tests: [
            {
                name: "Confirm that the client-side renderer can add content after an existing element...",
                sequence: [
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.goto",
                        args: ["{gpii.test.handlebars.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getElementHtml, ".viewport-after", "next"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The new element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-after", "{gpii.test.handlebars.browser.environment}.options.patterns.renderedMarkdown", "next"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-after", "{gpii.test.handlebars.browser.environment}.options.patterns.variable", "next"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.equalThingsAreTrue, ".viewport-after", "next"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons in the new element should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.unequalThingsAreFalse, ".viewport-after", "next"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons in the new element should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-after", "{gpii.test.handlebars.browser.environment}.options.patterns.originalContent"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The original element should not have been updated...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-after", "{gpii.test.handlebars.browser.environment}.options.patterns.partialContent", "next"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element after the original should have rendered content...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can append content to an existing element...",
                sequence: [
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.goto",
                        args: ["{gpii.test.handlebars.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getElementHtml, ".viewport-append"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-append", "{gpii.test.handlebars.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-append", "{gpii.test.handlebars.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.equalThingsAreTrue, ".viewport-append"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.unequalThingsAreFalse, ".viewport-append"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-append", "{gpii.test.handlebars.browser.environment}.options.patterns.originalContentAtBeginning"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The original content should be at the start of the original element...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can add content before an existing element...",
                sequence: [
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.goto",
                        args: ["{gpii.test.handlebars.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getElementHtml, ".viewport-before", "prev"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The new element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-before", "{gpii.test.handlebars.browser.environment}.options.patterns.renderedMarkdown", "prev"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-before", "{gpii.test.handlebars.browser.environment}.options.patterns.variable", "prev"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.equalThingsAreTrue, ".viewport-before", "prev"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons in the new element should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.unequalThingsAreFalse, ".viewport-before", "prev"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons in the new element should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-before", "{gpii.test.handlebars.browser.environment}.options.patterns.originalContent"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The original element should not have been updated...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-before", "{gpii.test.handlebars.browser.environment}.options.patterns.partialContent", "prev"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element before the original should have renderered content...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can replace existing html content in an element...",
                sequence: [
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.goto",
                        args: ["{gpii.test.handlebars.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getElementHtml, ".viewport-html"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-html", "{gpii.test.handlebars.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-html", "{gpii.test.handlebars.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.equalThingsAreTrue, ".viewport-html"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.unequalThingsAreFalse, ".viewport-html"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-html", "{gpii.test.handlebars.browser.environment}.options.patterns.originalContent"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:     ["The original content should no longer be found...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can prepend content to an existing element...",
                sequence: [
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.goto",
                        args: ["{gpii.test.handlebars.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getElementHtml, ".viewport-prepend"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-prepend", "{gpii.test.handlebars.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-prepend", "{gpii.test.handlebars.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.equalThingsAreTrue, ".viewport-prepend"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.unequalThingsAreFalse, ".viewport-prepend"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-prepend", "{gpii.test.handlebars.browser.environment}.options.patterns.originalContentAtEnd"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The original content should be at the end of the original element...", "{arguments}.0"]
                    }

                ]
            },
            {
                name: "Confirm that the client-side renderer can replace an existing element altogether...",
                sequence: [
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.goto",
                        args: ["{gpii.test.handlebars.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getElementHtml, ".viewport-replaceWith.replaced"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-replaceWith.replaced", "{gpii.test.handlebars.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-replaceWith.replaced", "{gpii.test.handlebars.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.equalThingsAreTrue, ".viewport-replaceWith.replaced"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [ gpii.test.handlebars.browser.unequalThingsAreFalse, ".viewport-replaceWith.replaced"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.elementMatches, ".viewport-replaceWith.replaced", "{gpii.test.handlebars.browser.environment}.options.patterns.originalContent"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:     ["The original content should no longer be found...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.test.handlebars.browser.environment({
    "port": 6596,
    "path": "content/tests-rendering.html",
    patterns: {
        originalContent:            "^original content$",
        originalContentAtBeginning: "^original content",
        originalContentAtEnd:       "original content$",
        partialContent:             "from the partial",
        renderedMarkdown:           "<p><em>this works<\/em><\/p>",
        variable:                   "modelvariable"
    },
    expected: {
        myvar: "modelvariable",
        markdown: "*this works*",
        json: {foo: "bar", baz: "quux", qux: "quux"}
    },
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.browser.renderer.caseHolder"
        }
    }
});
