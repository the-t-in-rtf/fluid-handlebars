// Throw an error message to test client-side error handling.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.registerNamespace("fluid.test.handlebars.jsonErrorPitcher");

fluid.test.handlebars.jsonErrorPitcher.middleware = function (that, req, res) {
    res.status(that.options.statusCode).send(that.options.body);
};

fluid.defaults("fluid.test.handlebars.jsonErrorPitcher", {
    gradeNames: ["fluid.express.middleware"],
    method:     "get",
    path:       "/error",
    statusCode: 500,
    body:       { message: "Something has gone horribly wrong as planned."},
    invokers: {
        middleware: {
            funcName: "fluid.test.handlebars.jsonErrorPitcher.middleware",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    }
});
