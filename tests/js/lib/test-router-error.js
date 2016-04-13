// Throw an error message to test client-side error handling.
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.handlebars.test.jsonErrorPitcher");

gpii.handlebars.test.jsonErrorPitcher.middleware = function (that, req, res) {
    res.status(that.options.statusCode).send(that.options.body);
};

fluid.defaults("gpii.handlebars.test.jsonErrorPitcher", {
    gradeNames: ["gpii.express.middleware"],
    method:     "get",
    path:       "/error",
    statusCode: 500,
    body:       { message: "Something has gone horribly wrong as planned."},
    invokers: {
        middleware: {
            funcName: "gpii.handlebars.test.jsonErrorPitcher.middleware",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});