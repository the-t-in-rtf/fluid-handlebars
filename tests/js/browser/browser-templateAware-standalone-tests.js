// Test "template aware" client-side components using `gpii-test-browser`.
//
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.defaults("gpii.tests.handlebars.browser.templateAware.standalone.caseHolder", {
    gradeNames: ["gpii.test.handlebars.browser.caseHolder"],
    rawModules: [{
        name: "Testing the standalone `templateAware` grade...",
        tests: [
            {
                name: "Confirm that the view contains rendered content (including variable data)...",
                sequence: [
                    {
                        func: "{gpii.test.handlebars.browser.environment}.webdriver.get",
                        args: ["{gpii.test.handlebars.browser.environment}.options.url"]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onGetComplete",
                        listener: "{testEnvironment}.webdriver.findElement",
                        args:     [{ css: ".templateAware-standalone-viewport"}]
                    },
                    {
                        event:    "{testEnvironment}.webdriver.events.onFindElementComplete",
                        listener: "gpii.test.handlebars.elementMatches",
                        args:     ["The view should contain rendered content...", "{arguments}.0", "getText", "This is our rendered template content."] // message, element, elementFn, pattern, invert
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.handlebars.browser.templateAware.standalone.testEnvironment", {
    gradeNames: ["gpii.test.handlebars.browser.environment"],
    path: "%gpii-handlebars/tests/static/tests-templateAware-standalone.html",
    url: "@expand:gpii.test.webdriver.resolveFileUrl({that}.options.path)",
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.browser.templateAware.standalone.caseHolder"
        }
    }
});

gpii.test.webdriver.allBrowsers({ baseTestEnvironment: "gpii.tests.handlebars.browser.templateAware.standalone.testEnvironment"});
