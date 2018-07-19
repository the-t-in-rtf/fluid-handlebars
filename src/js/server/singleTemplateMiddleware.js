/*

    Middleware that uses the standard renderer to render a single template.  See the docs for details:

    https://github.com/GPII/gpii-handlebars/blob/master/docs/singleTemplateMiddleware.md

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.express.singleTemplateMiddleware");

gpii.express.singleTemplateMiddleware.renderForm = function (that, request, response) {
    // TODO: Derive the messages based on the request, reuse the code from inlineMessageBundlingMiddleware
    // TODO: Merge that with the generated context.
    var generatedContext = fluid.model.transformWithRules({ model: that.model, req: request}, that.options.rules.contextToExpose);
    response.status(200).render(that.options.templateKey, generatedContext);
};

fluid.defaults("gpii.express.singleTemplateMiddleware", {
    gradeNames:      ["gpii.express.middleware"],
    namespace:       "singleTemplateMiddleware", // Namespace to make it easier for other routers to put themselves in the chain before or after us.
    path:            "/",
    method:          "get",
    rules: {
        contextToExpose: {
            "req": {
                "params": "req.params",
                "query":  "req.query"
            }
        }
    },
    invokers: {
        middleware: {
            funcName: "gpii.express.singleTemplateMiddleware.renderForm",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"] // request, response
        }
    }
});
