/*

    The test fixtures used for browser testing.

 */
"use strict";
var fluid = require("infusion");

require("../../test-harness");

// A case holder that waits for the environment to signal that both Express and Nightmare are ready.
fluid.defaults("gpii.templates.tests.browser.caseHolder", {
    gradeNames: ["gpii.express.tests.caseHolder.base"],
    sequenceStart: [
        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
            func: "{gpii.templates.tests.browser.environment}.events.constructFixtures.fire"
        },
        {
            listener: "fluid.identity",
            event: "{gpii.templates.tests.browser.environment}.events.onBrowserReady"
        }
    ],
    // Manually kill off our fixtures when the tests are finished, and wait for them to die.
    // TODO:  Review with Antranig, this does not seem to prevent "address in use" errors within a single test fixture,
    // but only when running through `all-tests.js`.
    sequenceEnd: [
        {
            func: "{gpii.templates.tests.browser.environment}.harness.destroy"
        },
        {
            func: "{gpii.templates.tests.browser.environment}.browser.end"
        },
        {
            listener: "fluid.identity",
            event: "{gpii.templates.tests.browser.environment}.events.onAllDone"
        }
    ]
});

// A test environment that has a harness and a Browser instance
fluid.defaults("gpii.templates.tests.browser.environment", {
    gradeNames: ["gpii.tests.browser.environment"],
    port: 6984,
    path: "",
    events: {
        constructFixtures: null,
        onBrowserDone:  null,
        onBrowserReady: null,
        onHarnessDone:  null,
        onHarnessReady: null,
        onAllDone: {
            events: {
                onBrowserDone: "onBrowserDone",
                onHarnessDone: "onHarnessDone"
            }
        },
        onReady: {
            events: {
                onHarnessReady: "onHarnessReady",
                onBrowserReady: "onBrowserReady"
            }
        }
    },
    url: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/%path", { port: "{that}.options.port", path: "{that}.options.path"}]
        }
    },
    components: {
        browser: {
            type: "gpii.tests.browser",
            createOnEvent: "constructFixtures",
            options: {
                listeners: {
                    "onEndComplete.notifyEnvironment": {
                        func: "{gpii.templates.tests.browser.environment}.events.onBrowserDone.fire"
                    },
                    // As we are not testing browser error states, we can safely tie all browser errors to a call to `fluid.fail`.
                    "onError.fail": {
                        func: "fluid.fail",
                        args: ["An unexpected browser error was encountered...", { expander: { funcName: "JSON.stringify", args: ["{arguments}.0"]}}]
                    },
                    "onReady.notifyEnvironment": {
                        func: "{gpii.templates.tests.browser.environment}.events.onBrowserReady.fire"
                    }
                }
            }
        },
        harness: {
            type: "gpii.templates.tests.client.harness",
            createOnEvent: "constructFixtures",
            options: {
                port: "{gpii.templates.tests.browser.environment}.options.port",
                listeners: {
                    "onStarted.notifyEnvironment": {
                        func: "{gpii.templates.tests.browser.environment}.events.onHarnessReady.fire"
                    },
                    "afterDestroy.notifyEnvironment": {
                        func: "{gpii.templates.tests.browser.environment}.events.onHarnessDone.fire"
                    }
                }
            }
        }
});