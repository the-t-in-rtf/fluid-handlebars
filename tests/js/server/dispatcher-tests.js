// Test all server side modules (including basic template rendering)...
/* eslint-env node */
"use strict";
var fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");

var jqUnit  = fluid.require("node-jqunit");
var request = require("request");

require("gpii-express");
require("../../../index");
require("./lib/sanity");

fluid.registerNamespace("gpii.tests.handlebars.server");


gpii.tests.handlebars.server.runTests = function (that) {
    jqUnit.module("Tests for dispatcher...");

    // Test the following variations:
    //
    //   1. The default home page with the default layout
    //   2. A custom page with matching layout
    //   3. A custom page with no matching layout
    //
    //  All variations should test partials and variables
    var pages = ["custom", "custom-no-matching-layout", ""];

    pages.forEach(function (page) {
        jqUnit.asyncTest("Test template handling dispatcher for page '" + page + "' ...", function () {
            request.get(that.options.baseUrl + "dispatcher/" + page + "?myvar=queryvariable", function (error, response, body) {
                jqUnit.start();

                gpii.test.handlebars.server.isSaneResponse(error, response, body);

                gpii.test.handlebars.server.bodyMatches("There should be layout content in the body...", body, /from the layout/);
                gpii.test.handlebars.server.bodyMatches("There should be page content in the body...", body, /from the page/);
                gpii.test.handlebars.server.bodyMatches("There should be partial content in the body...", body, /from the partial/);
                gpii.test.handlebars.server.bodyMatches("The results should contain transformed markdown.", body, /<p><em>this works<\/em><\/p>/i);
                gpii.test.handlebars.server.bodyMatches("There should be model variable content in the body...", body, /modelvariable/);
                gpii.test.handlebars.server.bodyMatches("There should be query variable content in the body...", body, /queryvariable/);

                // Tests for the "equals" helper.  We don't use the standard function because we want to inspect the individual results more closely.
                var equalsElementRegexp = /<td class="equal">([^<]+)<\/td>/;
                var equalMatches = body.match(equalsElementRegexp);
                jqUnit.assertNotNull("There should be 'equal' content.", equalMatches);
                for (var b = 1; b < equalMatches.length; b++) {
                    var equalElementText = equalMatches[b];
                    jqUnit.assertEquals("All 'equal' comparisons should end up displaying 'true'.", "true", equalElementText);
                }

                var unequalRegexp = /<td class="unequal">([^<]+)<\/td>/;
                var unequalMatches = body.match(unequalRegexp);
                jqUnit.assertNotNull("There should be 'unequal' content.", unequalMatches);
                for (var c = 1; c < unequalMatches.length; c++) {
                    var unequalElementText = unequalMatches[c];
                    jqUnit.assertEquals("All 'unequal' comparisons should end up displaying 'false'.", "false", unequalElementText);
                }

                // Tests for the "jsonify" (JSON.stringify) helper.  We don't use the standard function because we want to inspect the results more closely.
                var jsonifyElementRegexp = /<td class="jsonify">([^<]+)<\/td>/;
                var matches = body.match(jsonifyElementRegexp);
                jqUnit.assertNotNull("There should be jsonify content.", matches);
                for (var a = 1; a < matches.length; a++) {
                    var jsonString = matches[a];
                    var data = JSON.parse(jsonString);
                    jqUnit.assertDeepEq("The JSON data should match the model", that.options.json, data);

                }
            });
        });
    });

    jqUnit.asyncTest("Test multiple view directories with dispatcher...", function () {
        request.get(that.options.baseUrl + "dispatcher/secondary", function (error, response, body) {
            jqUnit.start();

            gpii.test.handlebars.server.bodyMatches("The default layout should have been used...", body, /Main Layout/);
            gpii.test.handlebars.server.bodyMatches("The secondary page should have been used...", body, /page served up from the secondary template directory/);
            gpii.test.handlebars.server.bodyMatches("The secondary partial should have been used...", body, /partial served from the secondary template director/);
        });
    });

    jqUnit.asyncTest("Test overriding of content when using multiple view directories with dispatcher...", function () {
        request.get(that.options.baseUrl + "dispatcher/overridden", function (error, response, body) {
            jqUnit.start();

            gpii.test.handlebars.server.bodyMatches("The layout should have come from the primary...", body, /layout found in the primary template directory/);
            gpii.test.handlebars.server.bodyMatches("The page should have come from the primary", body, /page served up from the primary template directory/);
            gpii.test.handlebars.server.bodyMatches("The partial should have come from the primary...", body, /partial served from the primary template directory/);
        });
    });
};

gpii.express({
    "port" :   6904,
    "baseUrl": "http://localhost:6904/",
    json: { foo: "bar", baz: "quux", qux: "quux" },
    listeners: {
        "onStarted.runTests": {
            funcName: "gpii.tests.handlebars.server.runTests",
            args:     ["{that}"]
        }
    },
    components: {
        "json": {
            "type": "gpii.express.middleware.bodyparser.json",
            options: {
                priority: "first"
            }
        },
        "urlencoded": {
            "type": "gpii.express.middleware.bodyparser.urlencoded",
            options: {
                priority: "after:json"
            }
        },
        handlebars: {
            type: "gpii.express.hb",
            options: {
                priority: "after:urlencoded",
                templateDirs: ["%gpii-handlebars/tests/templates/primary", "%gpii-handlebars/tests/templates/secondary"]
            }
        },
        dispatcher: {
            type: "gpii.handlebars.dispatcherMiddleware",
            options: {
                priority: "last",
                path: ["/dispatcher/:template", "/dispatcher"],
                templateDirs: ["%gpii-handlebars/tests/templates/primary", "%gpii-handlebars/tests/templates/secondary"],
                rules: {
                    contextToExpose: {
                        myvar:    { literalValue: "modelvariable" },
                        markdown: { literalValue: "*this works*" },
                        json:     { literalValue: "{express}.options.json" },
                        req:      { params: "req.params", query: "req.query"}
                    }
                }
            }
        }
    }
});
