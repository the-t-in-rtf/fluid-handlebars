/*

    Common "match definitions" used in many of the browser tests.

 */
/* globals jqUnit */
(function (fluid, jqUnit) {
    "use strict";
    var gpii  = fluid.registerNamespace("gpii");

    fluid.registerNamespace("gpii.test.handlebars.browser");

    gpii.test.handlebars.browser.matchDefs = {
        standard: {
            markdown: {
                message: "The element should contain rendered markdown.",
                pattern: "this works",
                selector: ".markdown p em"
            },
            variable: {
                message: "The new element should contain rendered variable content.",
                pattern: "modelvariable",
                selector: ".variable"
            },
            partial: {
                message: "The element after the original should have rendered content.",
                pattern:  "from the partial"
            },
            equals: {
                message: "Equal comparisons should display the correct text (true).",
                pattern: "true",
                selector: ".equal"
            },
            unequals: {
                message: "Unequal comparisons should display the correct text (false).",
                pattern: "false",
                selector: ".unequal"
            }
        },
        noOriginalContent: {
            removed: {
                message: "The original content should no longer be found.",
                pattern: "original content",
                invert:  true
            }
        },
        originalContent: {
            preserved: {
                message: "The original content should be preserved in its entirety.",
                pattern: "^original content$"
            }
        },
        originalContentAtBeginning: {
            atBeginning: {
                message: "The original content should still be at the start of the element.",
                pattern: "^original content"
            }
        },
        originalContentAtEnd: {
            atEnd: {
                message: "The original content should be found at the end of the element",
                pattern: "original content$"
            }
        }
    };

    /**
     *
     * Test a single set of matching elements to see if it matches a pattern.
     *
     * @param {String} message - A description of this specific test.
     * @param {Array<Object>} element - A single jQuery object.
     * @param {Regexp} pattern - The pattern to test the return value against.
     * @param {Boolean} invert - Whether to invert the match (consider the fact that it's missing as success.
     */
    gpii.test.handlebars.browser.elementMatches = function (message, element, pattern, invert) {
        var fnName = invert ? "assertFalse" : "assertTrue";
        var elementText = element.text ? element.text() : element.textContent;
        jqUnit[fnName](message, elementText.match(pattern));
    };

    /**
     *
     * Inspect one or more elements against a range of patterns.  Used to avoid having repeated test sequences for
     * common renderer checks.  Calls `gpii.test.handlebars.elementMatches` (see above) for each element and match
     * definition.
     *
     * @param {Object|Array<Object>} elements - One or more jQuery selectors that will be used to locate the container for all sub-elements.
     * @param {Object} matchDefs - A structure that defines the `message` associated with the test, the `elementFn` to use to get the value, and the `pattern' to compare to the value.  May include a 'locator' to inspect a sub-element.
     *
     */
    gpii.test.handlebars.browser.sanityCheckElements = function (elements, matchDefs) {
        fluid.each(fluid.makeArray(elements), function (element) {
            fluid.each(matchDefs, function (matchDef) {
                if (matchDef.selector) {
                    var subElements = $(element).find(matchDef.selector);
                    var pass = 1;
                    fluid.each(subElements, function (subElement) {
                        gpii.test.handlebars.browser.elementMatches(matchDef.message + " (pass " + pass + ")", subElement, matchDef.pattern, matchDef.invert);
                        pass++;
                    });
                }
                else {
                    gpii.test.handlebars.browser.elementMatches(matchDef.message, element, matchDef.pattern, matchDef.invert);
                }
            });
        });
    };

    /**
     *
     * Inspect one or more elements against a range of patterns.  Used to avoid having repeated test sequences for
     * common renderer checks.  Calls `gpii.test.handlebars.elementMatches` (see above) for each element and match
     * definition.
     *
     * @param {String|Array<String>} selectors - One or more jQuery selectors that will be used to locate the container for all sub-elements.
     * @param {Object} matchDefs - A structure that defines the `message` associated with the test, the `elementFn` to use to get the value, and the `pattern' to compare to the value.  May include a 'locator' to inspect a sub-element.
     *
     */
    gpii.test.handlebars.browser.sanityCheckSelectors = function (selectors, matchDefs) {
        var elements = fluid.transform(fluid.makeArray(selectors), function (selector) {
            return $(selector);
        });
        gpii.test.handlebars.browser.sanityCheckElements(fluid.flatten(elements), matchDefs);
    };
})(fluid, jqUnit);
