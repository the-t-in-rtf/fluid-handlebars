// Test all server side modules (including basic template rendering)...
/* eslint-env node */
"use strict";
var fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");

var jqUnit  = fluid.require("node-jqunit");
var request = require("request");

fluid.require("%gpii-express");
fluid.require("%gpii-handlebars");
require("./lib/sanity.js");

fluid.registerNamespace("gpii.tests.handlebars.server.inline");
gpii.tests.handlebars.server.inline.runTests = function (that) {
    jqUnit.module("Tests for inlining of templates...");

    jqUnit.asyncTest("Confirm that template content is inlined...", function () {
        request.get(that.options.baseUrl + "inline", function (error, response, body) {
            jqUnit.start();

            gpii.test.handlebars.server.isSaneResponse(error, response, body);

            if (body) {
                var data = typeof body === "string" ? JSON.parse(body) : body;
                jqUnit.assertNotNull("There should be templates returned...", data.templates);
                ["layouts", "pages", "partials"].forEach(function (key) {
                    jqUnit.assertTrue("There should be at least some content for each template type...", Object.keys(data.templates[key]).length > 0);
                });
            }
        });
    });

    jqUnit.asyncTest("Confirm that caching works as expected...", function () {
        request.get({ url: that.options.baseUrl + "inline", headers: { "If-None-Match": "98c72d5483a86f85a28241389e016eb9"}}, function (error, response, body) {
            jqUnit.start();
            jqUnit.assertFalse("There should be no errors...", error);
            jqUnit.assertEquals("The status code should indicate that the content hasn't changed...", 304, response.statusCode);
            jqUnit.assertEquals("The response should include a valid ETag header...", "98c72d5483a86f85a28241389e016eb9", response.headers.etag);
            jqUnit.assertEquals("The body should be empty...", "", body);
        });
    });
};

gpii.express({
    "port" :   6914,
    "baseUrl": "http://localhost:6914/",
    json: { foo: "bar", baz: "quux", qux: "quux" },
    listeners: {
        "onStarted.runTests": {
            funcName: "gpii.tests.handlebars.server.inline.runTests",
            args:     ["{that}"]
        }
    },
    components: {
        inline: {
            type: "gpii.handlebars.inlineTemplateBundlingMiddleware",
            options: {
                templateDirs: ["%gpii-handlebars/tests/templates/primary", "%gpii-handlebars/tests/templates/secondary"]
            }
        }
    }
});
