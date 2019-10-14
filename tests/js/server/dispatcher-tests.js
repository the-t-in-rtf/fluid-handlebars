// Test all server side modules (including basic template rendering)...
/* eslint-env node */
"use strict";
var fluid = require("infusion");

var gpii = fluid.registerNamespace("gpii");

var jqUnit  = fluid.require("node-jqunit");

fluid.require("%gpii-express");
gpii.express.loadTestingSupport();

fluid.require("%gpii-handlebars");
require("./lib/sanity");

fluid.registerNamespace("gpii.tests.handlebars.server.dispatcher");

gpii.tests.handlebars.server.dispatcher.checkStandardBody = function (expectedJson, response, body) {
    gpii.test.handlebars.server.isSaneResponse(null, response, body);

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
    var jsonContentMatches = body.match(jsonifyElementRegexp);
    jqUnit.assertNotNull("There should be jsonify content.", jsonContentMatches);
    for (var a = 1; a < jsonContentMatches.length; a++) {
        var jsonString = jsonContentMatches[a];
        var data = JSON.parse(jsonString);
        jqUnit.assertDeepEq("The JSON data should match the model", expectedJson, data);
    }
};

gpii.tests.handlebars.server.dispatcher.checkSecondaryBody = function (body) {
    gpii.test.handlebars.server.bodyMatches("The default layout should have been used...", body, /Main Layout/);
    gpii.test.handlebars.server.bodyMatches("The secondary page should have been used...", body, /page served up from the secondary template directory/);
    gpii.test.handlebars.server.bodyMatches("The secondary partial should have been used...", body, /partial served from the secondary template director/);
};

gpii.tests.handlebars.server.dispatcher.checkOverridenBody = function (body) {
    gpii.test.handlebars.server.bodyMatches("The layout should have come from the primary...", body, /layout found in the primary template directory/);
    gpii.test.handlebars.server.bodyMatches("The page should have come from the secondary", body, /page served up from the secondary template directory/);
    gpii.test.handlebars.server.bodyMatches("The partial should have come from the secondary...", body, /partial served from the secondary template directory/);
};

fluid.defaults("gpii.tests.handlebars.dispatcher.request", {
    gradeNames: ["kettle.test.request.http"],
    port: "{testEnvironment}.options.port",
    path: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["%baseUrl%endpoint", { baseUrl: "{testEnvironment}.options.baseUrl", endpoint: "{that}.options.endpoint"}]
        }
    }
});


fluid.defaults("gpii.tests.handlebars.dispatcher.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    rawModules: [{
        name: "Testing dispatcher middleware.",
        tests: [
            {
                name: "Testing dispatcher default page.",
                sequence: [
                    { func: "{defaultPageRequest}.send" },
                    {
                        event:    "{defaultPageRequest}.events.onComplete",
                        listener: "gpii.tests.handlebars.server.dispatcher.checkStandardBody",
                        args:     ["{testEnvironment}.options.jsonPayload", "{defaultPageRequest}.nativeResponse", "{arguments}.0"] // expectedJson, response, body
                    }
                ]
            },
            {
                name: "Testing dispatcher with a custom page that has a layout.",
                sequence: [
                    { func: "{customPageRequest}.send" },
                    {
                        event:    "{customPageRequest}.events.onComplete",
                        listener: "gpii.tests.handlebars.server.dispatcher.checkStandardBody",
                        args:     ["{testEnvironment}.options.jsonPayload", "{customPageRequest}.nativeResponse", "{arguments}.0"] // response, body
                    }
                ]
            },
            {
                name: "Testing dispatcher with a custom page that doesn't have a layout.",
                sequence: [
                    { func: "{customPageNoLayoutRequest}.send" },
                    {
                        event:    "{customPageNoLayoutRequest}.events.onComplete",
                        listener: "gpii.tests.handlebars.server.dispatcher.checkStandardBody",
                        args:     ["{testEnvironment}.options.jsonPayload", "{customPageNoLayoutRequest}.nativeResponse", "{arguments}.0"] // response, body
                    }
                ]
            },
            {
                name: "Test multiple view directories with dispatcher.",
                sequence: [
                    { func: "{secondaryViewDirRequest}.send" },
                    {
                        event: "{secondaryViewDirRequest}.events.onComplete",
                        listener: "gpii.tests.handlebars.server.dispatcher.checkSecondaryBody",
                        args: ["{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test overriding of content when using multiple view directories with dispatcher.",
                sequence: [
                    { func: "{overriddenViewDirRequest}.send" },
                    {
                        event: "{overriddenViewDirRequest}.events.onComplete",
                        listener: "gpii.tests.handlebars.server.dispatcher.checkOverridenBody",
                        args: ["{arguments}.0"]
                    }
                ]
            }
        ]
    }],
    components: {
        defaultPageRequest: {
            type: "gpii.tests.handlebars.dispatcher.request",
            options: {
                endpoint: "dispatcher?myvar=queryvariable"
            }
        },
        customPageRequest: {
            type: "gpii.tests.handlebars.dispatcher.request",
            options: {
                endpoint: "dispatcher/custom?myvar=queryvariable"
            }
        },
        customPageNoLayoutRequest: {
            type: "gpii.tests.handlebars.dispatcher.request",
            options: {
                endpoint: "dispatcher/custom-no-matching-layout?myvar=queryvariable"
            }
        },
        secondaryViewDirRequest: {
            type: "gpii.tests.handlebars.dispatcher.request",
            options: {
                endpoint: "dispatcher/secondary"
            }
        },
        overriddenViewDirRequest: {
            type: "gpii.tests.handlebars.dispatcher.request",
            options: {
                endpoint: "dispatcher/overridden"
            }
        }
    }
});

fluid.defaults("gpii.tests.handlebars.dispatcher.environment", {
    gradeNames: ["gpii.test.express.testEnvironment"],
    port: 6904,
    jsonPayload: { foo: "bar", baz: "quux", qux: "quux" },
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.dispatcher.caseHolder"
        },
        express: {
            options: {
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
                            templateDirs: {
                                primary: "%gpii-handlebars/tests/templates/primary",
                                secondary: {
                                    path: "%gpii-handlebars/tests/templates/secondary",
                                    priority: "after:primary"
                                }
                            }
                        }
                    },
                    dispatcher: {
                        type: "gpii.handlebars.dispatcherMiddleware",
                        options: {
                            priority: "last",
                            path: ["/dispatcher/:template", "/dispatcher"],
                            templateDirs: {
                                primary: "%gpii-handlebars/tests/templates/primary",
                                secondary: {
                                    path: "%gpii-handlebars/tests/templates/secondary",
                                    priority: "after:primary"
                                }
                            },
                            rules: {
                                contextToExpose: {
                                    myvar:    { literalValue: "modelvariable" },
                                    markdown: { literalValue: "*this works*" },
                                    json:     { literalValue: "{testEnvironment}.options.jsonPayload" },
                                    req:      { params: "req.params", query: "req.query"}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});

fluid.test.runTests("gpii.tests.handlebars.dispatcher.environment");
