// Test "template aware" client-side components using `gpii-test-browser`.
//
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.registerNamespace("gpii.tests.handlebars.browser.templateAware");

fluid.defaults("gpii.tests.handlebars.browser.templateAware.caseHolder", {
    gradeNames: ["gpii.test.handlebars.browser.caseHolder"],
    matchDefs: {
        contained: {
            outside: {
                message: "Content outside of the inner container should not have been disturbed...",
                pattern: "This content should not be overwritten."
            },
            inside: {
                message: "The original content of the inner container should have been updated...",
                pattern: "A place for everything, and everything in its place."
            }
        }
    },
    rawModules: [{
        name: "Testing the `templateAware` client side grade...",
        tests: [
            {
                name: "Confirm that the templateAware component is rendered correctly...",
                sequence: [
                    {
                        func: "{gpii.test.handlebars.browser.environment}.webdriver.get",
                        args: ["{gpii.test.handlebars.browser.environment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".viewport"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.standard"] //elements, matchDefs
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".viewport"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.originalContent"] //elements, matchDefs
                    },
                    {
                        func: "{testEnvironment}.webdriver.findElement",
                        args: [{ css: ".contained"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.sanityCheckElements",
                        args:     ["{arguments}.0", "{that}.options.matchDefs.contained"] //elements, matchDefs
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.handlebars.browser.templateAware.testEnvironment", {
    gradeNames: ["gpii.test.handlebars.browser.environment"],
    port: 6895,
    path: "content/tests-templateAware-serverAware.html",
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.browser.templateAware.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.handlebars.browser.templateAware.testEnvironment"});
