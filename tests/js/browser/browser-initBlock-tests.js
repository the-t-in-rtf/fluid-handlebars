// Test `initBlock` server-side Handlebars helper.
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("gpii-test-browser");
gpii.tests.browser.loadTestingSupport();

require("./lib/fixtures");
require("../../../index");

fluid.registerNamespace("gpii.templates.tests.browser.initBlock");
gpii.templates.tests.browser.initBlock.selectorContains = function (selector, subString) {
    /* globals document */
    var mainString = document.querySelector(selector).innerHTML;
    return mainString.indexOf(subString) !== -1;
};

fluid.defaults("gpii.templates.tests.browser.initBlock.caseHolder", {
    gradeNames: ["gpii.templates.tests.browser.caseHolder"],
    rawModules: [{
        tests: [
            {
                name: "Confirm the page was rendered and that the initBlock component was created correctly...",
                sequence: [
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.goto",
                        args: ["{gpii.templates.tests.browser.environment}.options.url"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.getGlobalValue, "pageComponent.requireRenderer.pageComponent.model"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertDeepEq",
                        args:     ["The component model should include query, parameter, default, and dispatcher data...", "{gpii.templates.tests.browser.environment}.options.expected", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.initBlock.selectorContains, "body", "This content should not be visible"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:     ["The original body content should have been replaced...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.templates.tests.browser.environment}.browser.evaluate",
                        args: [gpii.templates.tests.browser.initBlock.selectorContains, "body", "coming from the page"]
                    },
                    {
                        event:    "{gpii.templates.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:     ["The body should contain template output...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.templates.tests.browser.environment({
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
            type: "gpii.templates.tests.browser.initBlock.caseHolder"
        }
    }
});