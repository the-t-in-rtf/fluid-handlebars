// Test client-side rendering using `gpii-test-browser` (Atom Electron and Chromium).
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.registerNamespace("gpii.tests.handlebars.browser.renderer.serverAware");

// There is no means of selecting a previous element using a CSS selector, for now we follow a more indirect approach, i.e. tagging
// the previous element with a tab and then looking it up using findElement.  In this way we end up with the same
// WebElement object as we would get from findElement.
// TODO:  Commit the old approach once as a reference, then delete.
gpii.tests.handlebars.browser.renderer.serverAware.tagPreviousSibling = function (selector, tag) {
    /* global document */
    var matchingElements = document.querySelectorAll(selector);
    if (matchingElements) {
        for (var a = 0; a < matchingElements.length; a++) {
            var element = matchingElements.item(a);
            var prevSibling = element.previousElementSibling;
            if (prevSibling) {
                var existingClasses = prevSibling.getAttribute("class");
                var allClasses = existingClasses ? existingClasses + " " + tag : tag;
                prevSibling.setAttribute("class", allClasses);
            }
        }
    }
};

// A function for use with webdriver.findElement(function).  Returns the previous sibling.
gpii.tests.handlebars.browser.renderer.serverAware.findPreviousSibling = function (selector) {
    /* global document */
    return document.querySelector(selector).previousElementSibling;
};

fluid.defaults("gpii.tests.handlebars.browser.renderer.serverAware.caseHolder", {
    gradeNames: ["gpii.test.handlebars.browser.caseHolder"],
    rawModules: [{
        name: "Testing browser template rendering...",
        tests: [
            {
                name: "Confirm that the client-side renderer can add content after an existing element...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".viewport-after + *"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.standard"] //elements, matchDefs
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".viewport-after"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.originalContent"] // elements, matchDefs
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can append content to an existing element...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".viewport-append"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.standard"] //elements, matchDefs
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{css: ".viewport-append"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.originalContentAtBeginning"] // elements, matchDefs
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can add content before an existing element...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.executeScript",
                        args:     [gpii.tests.handlebars.browser.renderer.serverAware.findPreviousSibling, ".viewport-before"] // selector, tag
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onExecuteScriptComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.standard"] //elements, matchDefs
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args:  [{ css: ".viewport-before"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.originalContent"] //elements, matchDefs
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can replace existing html content in an element...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".viewport-html"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.standard"] //elements, matchDefs
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args:  [{ css: ".viewport-html"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.noOriginal"] //elements, matchDefs
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can prepend content to an existing element...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".viewport-prepend"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.standard"] //elements, matchDefs
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args:  [{ css: ".viewport-prepend"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.originalContentAtEnd"] //elements, matchDefs
                    }
                ]
            },
            {
                name: "Confirm that the client-side renderer can replace an existing element altogether...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".viewport-replaceWith.replaced"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.standard"] //elements, matchDefs
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args:  [{ css: ".viewport-replaceWith.replaced"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.noOriginal"] //elements, matchDefs
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.handlebars.browser.renderer.serverAware.testEnvironment", {
    gradeNames: ["gpii.test.handlebars.browser.environment"],
    port: 6596,
    path: "content/tests-renderer-serverAware.html",
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.browser.renderer.serverAware.caseHolder"
        },
        webdriver: {
            options: {
                listeners: {
                    "onError.log": {
                        funcName: "console.log",
                        args: ["BROWSER ERROR:", "{arguments}.0"]
                    }
                }
            }
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.handlebars.browser.renderer.serverAware.testEnvironment"});
