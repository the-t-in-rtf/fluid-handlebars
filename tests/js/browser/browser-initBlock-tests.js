// Test `initBlock` server-side Handlebars helper.
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.registerNamespace("gpii.tests.handlebars.browser.initBlock");
gpii.tests.handlebars.browser.initBlock.selectorContains = function (selector, subString) {
    /* globals document */
    var mainString = document.querySelector(selector).innerHTML;
    return mainString.indexOf(subString) !== -1;
};

fluid.defaults("gpii.tests.handlebars.browser.initBlock.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.withExpress"],
    rawModules: [{
        tests: [
            {
                name: "Confirm the page was rendered and that the initBlock component was created correctly...",
                sequence: [
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.goto",
                        args: ["{gpii.test.handlebars.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "pageComponent.requireRenderer.pageComponent.model"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The component model should include query, parameter, default, and dispatcher data...", "{gpii.test.handlebars.browser.environment}.options.expected", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.tests.handlebars.browser.initBlock.selectorContains, "body", "This content should not be visible"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:     ["The original body content should have been replaced...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.handlebars.browser.environment}.browser.evaluate",
                        args: [gpii.tests.handlebars.browser.initBlock.selectorContains, "body", "coming from the page"]
                    },
                    {
                        event:    "{gpii.test.handlebars.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The body should contain template output...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.test.handlebars.browser.environment({
    "port": 6995,
    "path": "dispatcher/initblock?myvar=bar",
    expected: {
        "hasDataFromGrade": true,
        "req": {
            "query": {
                "myvar": "bar"
            },
            "params": {
                "template": "initblock"
            }
        },
        "json": {
            "foo": "bar",
            "baz": "quux",
            "qux": "quux"
        },
        "myvar": "modelvariable",
        "markdown": "*this works*"
    },
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.browser.initBlock.caseHolder"
        }
    }
});