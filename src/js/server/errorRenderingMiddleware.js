/*

    A `fluid.express.middleware.error` component that uses the standard renderer to return an error to a user, see the
    documentation for details:

    https://github.com/fluid-project/fluid-handlebars/blob/main/docs/errorRenderingMiddleware.md

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");

fluid.require("fluid-express");

fluid.registerNamespace("fluid.handlebars.errorRenderingMiddleware");
fluid.handlebars.errorRenderingMiddleware.renderError = function (that, error, request, response, next) {
    if (fluid.handlebars.errorRenderingMiddleware.isOurContentType(that, request)) {
        // TODO: figure out the message bundle for this request and merge with the error so that we can use i18n in errors.
        response.status(that.options.statusCode).render(that.options.templateKey, error);
    }
    else {
        next(error);
    }
};


/**
 *
 * Confirm that this request matches our content type, if we have them.
 *
 * @param {Object} that - The middleware component itself.
 * @param {Object} request - The request object.
 * @return {Boolean} - Returns `true` if the request accepts a content type we support, or `false` if it doesn't.
 *
 */
fluid.handlebars.errorRenderingMiddleware.isOurContentType = function (that, request) {
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

fluid.defaults("fluid.handlebars.errorRenderingMiddleware", {
    gradeNames:  ["fluid.express.middleware.error"],
    statusCode:  500,
    contentType: "text/html",
    namespace:   "errorRenderingMiddleware", // Namespace to make it easier for other routers to put themselves in the chain before or after us.
    method:      "use",
    invokers: {
        middleware: {
            funcName: "fluid.handlebars.errorRenderingMiddleware.renderError",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2", "{arguments}.3"] // error, request, response, next
        }
    }
});
