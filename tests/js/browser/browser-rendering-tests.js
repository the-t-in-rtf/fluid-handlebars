// Test client-side rendering using `gpii-test-browser` (Atom Electron and Chromium).
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("gpii-test-browser");
gpii.tests.browser.loadTestingSupport();

require("../../../index");
require("./lib/fixtures");

fluid.registerNamespace("gpii.templates.tests.browser.renderer");

/* globals $ */
/*

    Look up an element using the jQuery selector `path`.  By default, returns the element's HTML for further inspection.

    If `fnName` is supplied (such as "next" or "previous"), the element's named function will be executed.  That
    function is expected to return an object which has an `html` function.

 */
gpii.templates.tests.browser.renderer.getElementHtml = function (path, fnName) {
    return fnName ? $(path)[fnName]().html() : $(path).html();
};

// TODO:  This pattern is likely more widely useful and should be moved to a library in this package or into `gpii-test-browser` if we use the pattern (pun intended) more widely.
/*

 Use the client-side jQuery to find an element matching `path`, and (by default) confirm if its HTML content matches `patternString`.

 Note that (as we are working with JSON configuration options), `patternString`is expected to be a string rather than an
 existing RegExp object.

 As with `getElementHtml`, if `fnName` is supplied, the element's named function will be executed and then the match
 will be checked.  That function is expected to return an object which has an `html` function.

 */
gpii.templates.tests.browser.renderer.elementMatches = function (path, patternString, fnName) {
    var element = fnName ? $(path)[fnName]() : $(path);
    return Boolean(element && element.html().match(new RegExp(patternString, "mi")));
};

gpii.templates.tests.browser.renderer.getJSONContent = function (path) {
    return JSON.parse($(path).html());
};

gpii.templates.tests.browser.renderer.equalThingsAreTrue = function (path, fnName) {
    var element = fnName ? $(path)[fnName]() : $(path);
    var equalCandidates = element.find(".equal");
    for (var a = 0; a < equalCandidates.length; a++) {
        if ($(equalCandidates[a]).text() !== "true") {
            return false;
        }
    }

    return true;
};

gpii.templates.tests.browser.renderer.unequalThingsAreFalse = function (path, fnName) {
    var element = fnName ? $(path)[fnName]() : $(path);
    var unequalCandidates = element.find(".unequal");
    for (var b = 0; b < unequalCandidates.length; b++) {
        if ($(unequalCandidates[b]).text() !== "false") {
            return false;
        }
    }

    return true;
};

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
                        args:     [gpii.templates.tests.browser.renderer.getElementHtml, ".viewport-after", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The new element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-after", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-after", "{gpii.templates.tests.browser.environment}.options.patterns.variable", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.equalThingsAreTrue, ".viewport-after", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons in the new element should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.unequalThingsAreFalse, ".viewport-after", "next"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons in the new element should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-after", "{gpii.templates.tests.browser.environment}.options.patterns.originalContent"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The original element should not have been updated...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-after", "{gpii.templates.tests.browser.environment}.options.patterns.partialContent", "next"]
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
                        args:     [gpii.templates.tests.browser.renderer.getElementHtml, ".viewport-append"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-append", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-append", "{gpii.templates.tests.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.equalThingsAreTrue, ".viewport-append"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.unequalThingsAreFalse, ".viewport-append"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-append", "{gpii.templates.tests.browser.environment}.options.patterns.originalContentAtBeginning"]
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
                        args:     [gpii.templates.tests.browser.renderer.getElementHtml, ".viewport-before", "prev"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The new element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-before", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown", "prev"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-before", "{gpii.templates.tests.browser.environment}.options.patterns.variable", "prev"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The new element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.equalThingsAreTrue, ".viewport-before", "prev"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons in the new element should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.unequalThingsAreFalse, ".viewport-before", "prev"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons in the new element should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-before", "{gpii.templates.tests.browser.environment}.options.patterns.originalContent"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The original element should not have been updated...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-before", "{gpii.templates.tests.browser.environment}.options.patterns.partialContent", "prev"]
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
                        args:     [gpii.templates.tests.browser.renderer.getElementHtml, ".viewport-html"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-html", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-html", "{gpii.templates.tests.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.equalThingsAreTrue, ".viewport-html"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.unequalThingsAreFalse, ".viewport-html"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-html", "{gpii.templates.tests.browser.environment}.options.patterns.originalContent"]
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
                        args:     [gpii.templates.tests.browser.renderer.getElementHtml, ".viewport-prepend"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-prepend", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-prepend", "{gpii.templates.tests.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.equalThingsAreTrue, ".viewport-prepend"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.unequalThingsAreFalse, ".viewport-prepend"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-prepend", "{gpii.templates.tests.browser.environment}.options.patterns.originalContentAtEnd"]
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
                        args:     [gpii.templates.tests.browser.renderer.getElementHtml, ".viewport-replaceWith.replaced"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertNotNull",
                        args:     ["The element should have html content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-replaceWith.replaced", "{gpii.templates.tests.browser.environment}.options.patterns.renderedMarkdown"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered markdown...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-replaceWith.replaced", "{gpii.templates.tests.browser.environment}.options.patterns.variable"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The element should contain rendered variable content...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.equalThingsAreTrue, ".viewport-replaceWith.replaced"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Equal comparisons should display the correct text (true)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [ gpii.templates.tests.browser.renderer.unequalThingsAreFalse, ".viewport-replaceWith.replaced"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["Unequal comparisons should display the correct text (false)...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.renderer.elementMatches, ".viewport-replaceWith.replaced", "{gpii.templates.tests.browser.environment}.options.patterns.originalContent"]
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
