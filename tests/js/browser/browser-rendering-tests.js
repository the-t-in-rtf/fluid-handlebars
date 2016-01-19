// Test client-side rendering using `gpii-test-browser` (Atom Electron and Chromium).
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.defaults("gpii.templates.tests.browser.renderer.caseHolder", {
    gradeNames: ["gpii.templates.tests.browser.caseHolder"],
    rawModules: [{
        tests: [
            {
                name: "Confirm that the client-side renderer can add content after an existing element...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.getElementHtml, ".viewport-after", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The new element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-after", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-after", "{gpii.templates.tests.browser.environment}.options.patterns.variable", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.equalThingsAreTrue, ".viewport-after", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons in the new element should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.unequalThingsAreFalse, ".viewport-after", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons in the new element should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-after", "{gpii.templates.tests.browser.environment}.options.patterns.originalContent"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The original element should not have been updated...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-after", "{gpii.templates.tests.browser.environment}.options.patterns.partialContent", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element after the original should have rendered content...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can append content to an existing element...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.getElementHtml, ".viewport-append"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-append", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-append", "{gpii.templates.tests.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.equalThingsAreTrue, ".viewport-append"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.unequalThingsAreFalse, ".viewport-append"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-append", "{gpii.templates.tests.browser.environment}.options.patterns.originalContentAtBeginning"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The original content should be at the start of the original element...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can add content before an existing element...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.getElementHtml, ".viewport-before", "prev"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The new element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-before", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown", "prev"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-before", "{gpii.templates.tests.browser.environment}.options.patterns.variable", "prev"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.equalThingsAreTrue, ".viewport-before", "prev"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons in the new element should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.unequalThingsAreFalse, ".viewport-before", "prev"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons in the new element should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-before", "{gpii.templates.tests.browser.environment}.options.patterns.originalContent"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The original element should not have been updated...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-before", "{gpii.templates.tests.browser.environment}.options.patterns.partialContent", "prev"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element before the original should have renderered content...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can replace existing html content in an element...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.getElementHtml, ".viewport-html"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-html", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-html", "{gpii.templates.tests.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.equalThingsAreTrue, ".viewport-html"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.unequalThingsAreFalse, ".viewport-html"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-html", "{gpii.templates.tests.browser.environment}.options.patterns.originalContent"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:     ["The original content should no longer be found...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can prepend content to an existing element...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.getElementHtml, ".viewport-prepend"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-prepend", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-prepend", "{gpii.templates.tests.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.equalThingsAreTrue, ".viewport-prepend"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.unequalThingsAreFalse, ".viewport-prepend"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-prepend", "{gpii.templates.tests.browser.environment}.options.patterns.originalContentAtEnd"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The original content should be at the end of the original element...", "{arguments}.0"]
                    }

                ]
            },
            {
                name: "Confirm that the client-side renderer can replace an existing element altogether...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.templates.tests.browser.getElementHtml, ".viewport-replaceWith.replaced"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-replaceWith.replaced", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-replaceWith.replaced", "{gpii.templates.tests.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.equalThingsAreTrue, ".viewport-replaceWith.replaced"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.unequalThingsAreFalse, ".viewport-replaceWith.replaced"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.elementMatches, ".viewport-replaceWith.replaced", "{gpii.templates.tests.browser.environment}.options.patterns.originalContent"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:     ["The original content should no longer be found...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.templates.tests.browser.environment({
    "port": 6595,
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
            type: "gpii.templates.tests.browser.renderer.caseHolder"
        }
    }
});
