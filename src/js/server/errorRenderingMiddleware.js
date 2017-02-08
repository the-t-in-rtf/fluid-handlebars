/*

    A `gpii.express.middleware.error` component that uses the standard renderer to return an error to a user, see the
    documentation for details:

    https://github.com/GPII/gpii-handlebars/blob/master/docs/errorRenderingMiddleware.md

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.handlebars.errorRenderingMiddleware");
gpii.handlebars.errorRenderingMiddleware.renderError = function (that, error, request, response, next) {
    if (gpii.handlebars.errorRenderingMiddleware.isOurContentType(that, request)) {
        response.status(that.options.statusCode).render(that.options.templateKey, error);
    }
    else {
        next(error);
    }
};


/**
 *
 * @param that {Object} - The middleware component itself.
 * @param request {Object} - The request object.
 *
 * Confirm that this request matches our content type, if we have them.
 *
 */
gpii.handlebars.errorRenderingMiddleware.isOurContentType = function (that, request) {
    if (that.options.contentType) {
        var contentTypes = fluid.makeArray(that.options.contentType);
        return fluid.find(contentTypes, function (contentType) {
            if (request.accepts(contentType)) {
                return true;
            }
        }, false);
    }
    // If we have no content type, we respond to everything.
    else {
        return true;
    }
};

fluid.defaults("gpii.handlebars.errorRenderingMiddleware", {
    gradeNames:  ["gpii.express.middleware.error"],
    statusCode:  500,
    contentType: "text/html",
    namespace:   "errorRenderingMiddleware", // Namespace to make it easier for other routers to put themselves in the chain before or after us.
    method:      "use",
    invokers: {
        middleware: {
            funcName: "gpii.handlebars.errorRenderingMiddleware.renderError",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // error, request, response, next
        }
    }
});
