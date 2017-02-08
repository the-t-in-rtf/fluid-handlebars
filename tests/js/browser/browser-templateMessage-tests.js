// Test "templateMessage" components using `gpii-test-browser`.
//
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.defaults("gpii.tests.handlebars.browser.templateMessage.caseHolder", {
    gradeNames: ["gpii.test.handlebars.browser.caseHolder"],
    matchDefs: {
        body: {
            initialMarkupReplaced: {
                message: "The initial markup should no longer be present...",
                pattern: "should not be visible",
                invert: true
            },
            renderedMarkup: {
                message: "There should be rendered content",
                pattern: "born with silver model data in my mouth"
            },
            updatedModelData: {
                message: "There should be updated model content...",
                pattern: "some have data thrust upon them"
            }
        }
    },
    rawModules: [{
        name: "Testing the `templateMessage` client-side grade...",
        tests: [
            {
                name: "Confirm that the templateMessage component is initialized and rendered correctly...",
                sequence: [
                    {
                        func: "{testEnvironment}.webdriver.get",
                        args: ["{testEnvironment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: "body"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.body"] //elements, matchDefs
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.handlebars.browser.templateMessage.testEnvironment", {
    gradeNames: ["gpii.test.handlebars.browser.environment"],
    "port": 6924,
    "path": "content/tests-templateMessage.html",
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.browser.templateMessage.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.handlebars.browser.templateMessage.testEnvironment"});
