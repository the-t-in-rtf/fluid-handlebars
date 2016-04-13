// Test `initBlock` server-side Handlebars helper.
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("./includes.js");

fluid.registerNamespace("gpii.handlebars.tests.browser.initBlock");
gpii.handlebars.tests.browser.initBlock.selectorContains = function (selector, subString) {
    /* globals document */
    var mainString = document.querySelector(selector).innerHTML;
    return mainString.indexOf(subString) !== -1;
};

fluid.defaults("gpii.handlebars.tests.browser.initBlock.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.withExpress"],
    rawModules: [{
        tests: [
            {
                name: "Confirm the page was rendered and that the initBlock component was created correctly...",
                sequence: [
                    {
                        func: "{gpii.handlebars.tests.browser.environment}.browser.goto",
                        args: ["{gpii.handlebars.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "pageComponent.requireRenderer.pageComponent.model"]
                    },
                    {
                        event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The component model should include query, parameter, default, and dispatcher data...", "{gpii.handlebars.tests.browser.environment}.options.expected", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                        args: [gpii.handlebars.tests.browser.initBlock.selectorContains, "body", "This content should not be visible"]
                    },
                    {
                        event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:     ["The original body content should have been replaced...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.handlebars.tests.browser.environment}.browser.evaluate",
                        args: [gpii.handlebars.tests.browser.initBlock.selectorContains, "body", "coming from the page"]
                    },
                    {
                        event:    "{gpii.handlebars.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The body should contain template output...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.handlebars.tests.browser.environment({
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
            type: "gpii.handlebars.tests.browser.initBlock.caseHolder"
        }
    }
});