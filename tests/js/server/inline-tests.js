// Test all server side modules (including basic template rendering)...
"use strict";
var fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");

var jqUnit  = fluid.require("node-jqunit");
var request = require("request");

require("gpii-express");
require("../../../index");
require("./lib/sanity.js");

fluid.registerNamespace("gpii.templates.tests.server.inline");
gpii.templates.tests.server.inline.runTests = function (that) {
    jqUnit.module("Tests for inlining of templates...");

    jqUnit.asyncTest("Confirm that template content is inlined...", function () {
        request.get(that.options.baseUrl + "inline", function (error, response, body) {
            jqUnit.start();

            gpii.templates.test.server.isSaneResponse(error, response, body);

            if (body) {
                var data = typeof body === "string" ? JSON.parse(body) : body;
                jqUnit.assertNotNull("There should be templates returned...", data.templates);
                ["layouts", "pages", "partials"].forEach(function (key) {
                    jqUnit.assertTrue("There should be at least some content for each template type...", Object.keys(data.templates[key]).length > 0);
                });
            }
        });
    });
};

gpii.express({
    "port" :   6914,
    "baseUrl": "http://localhost:6914/",
    json: { foo: "bar", baz: "quux", qux: "quux" },
    listeners: {
        "onStarted.runTests": {
            funcName: "gpii.templates.tests.server.inline.runTests",
            args:     ["{that}"]
        }
    },
    components: {
        inline: {
            type: "gpii.templates.inlineTemplateBundlingMiddleware",
            options: {
                templateDirs: ["%gpii-handlebars/tests/templates/primary", "%gpii-handlebars/tests/templates/secondary"]
            }
        }
    }
});