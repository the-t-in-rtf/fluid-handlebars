/*

    Tests for the combined grade that retrieves templates and i18n message bundles from server components.
*/

/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
require("./includes.js");

fluid.registerNamespace("gpii.tests.handlebars.browser.serverMessageAware");

fluid.defaults("gpii.tests.handlebars.browser.serverMessageAware.caseHolder", {
    gradeNames: ["gpii.test.handlebars.browser.caseHolder"],
    matchDefs: {
        serverMessageAware: {
            howAreThings: {
                message: "Basic i18n message rendering should work.",
                pattern: "Things are fine.",
                locator: { css: "#how-are-things"}
            },
            shallowVariable: {
                message: "The new element should contain rendered variable content.",
                pattern: "This is working.",
                locator: { css: "#shallow-variable"}
            },
            deepVariable: {
                message: "The element after the original should have rendered content.",
                pattern:  "This is even better.",
                locator: { css: "#deep-variable" }
            },
            nonRootContext: {
                message: "We should be able to specify the context for variables.",
                pattern: "This is better.",
                locator: { css: "#non-root-context"}
            }
        }
    },
    rawModules: [{
        name: "Testing rendering of i18n messages using serverMessageAware grade.",
        tests: [
            {
                name: "Confirm that the serverMessageAware grade can render internationalised/localised content.",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".viewport"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.serverMessageAware"] //elements, matchDefs
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.handlebars.browser.serverMessageAware.testEnvironment", {
    gradeNames: ["gpii.test.handlebars.browser.environment"],
    port: 6596,
    path: "content/tests-serverMessageAware.html",
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.browser.serverMessageAware.caseHolder"
        },
        webdriver: {
            options: {
                browser: "chrome",
                browserOptions: {
                    chrome: {
                        chromeOptions: {
                            prefs: {
                                "intl": {
                                    "accept_languages": "en-US"
                                }
                            }
                        }
                    }
                },
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

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.handlebars.browser.serverMessageAware.testEnvironment"});
