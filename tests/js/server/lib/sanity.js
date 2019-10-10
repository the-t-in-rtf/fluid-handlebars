/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.test.handlebars.server");
gpii.test.handlebars.server.isSaneResponse = function (error, response, body) {
    jqUnit.assertNull("There should be no errors.", error);

    jqUnit.assertEquals("The response should have a reasonable status code", 200, response.statusCode);
    if (response.statusCode !== 200) {
        fluid.log(JSON.stringify(body, null, 2));
    }

    jqUnit.assertNotNull("There should be a body.", body);
};


gpii.test.handlebars.server.bodyMatches = function (message, body, pattern, shouldNotMatch) {
    var matches = body.match(pattern);
    if (shouldNotMatch) {
        jqUnit.assertNull(message, matches);
    }
    else {
        jqUnit.assertNotNull(message, matches);
    }
};
