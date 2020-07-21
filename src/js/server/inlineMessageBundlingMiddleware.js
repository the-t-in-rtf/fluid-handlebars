/*

    Middleware that combines all available Handlebars templates into a single bundle that can be downloaded and used
    by the client-side renderer.  For more information, see the docs:

    https://github.com/fluid-project/fluid-handlebars/blob/master/docs/inline.md

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var md5   = require("md5");

require("./lib/i18n-node");

fluid.registerNamespace("fluid.handlebars.inlineMessageBundlingMiddleware.request");

fluid.handlebars.inlineMessageBundlingMiddleware.request.sendResponse = function (that) {
    if (that.model.messageBundles) {
        var messageBundle = fluid.handlebars.i18n.deriveMessageBundleFromRequest(that.options.request, that.model.messageBundles, that.options.defaultLocale);
        var md5Sum = md5(JSON.stringify(messageBundle));
        // Always set the "etag" header so that we always have something to compare for each subsequent request.
        that.options.response.set("ETag", md5Sum);

        if (that.options.request.headers["if-none-match"] === md5Sum) {
            // A 304 response should not send a message body.  See https://httpstatuses.com/304 for an explanation (includes links to the relevant RFC as well).
            that.options.response.status(304).end();
        }
        else {
            fluid.express.handler.sendResponse(that, that.options.response, 200, messageBundle);
        }
    }
    else {
        fluid.express.handler.sendResponse(that, that.options.response, 500, { isError: true, message: that.options.messages.noMessages});
    }
};

fluid.defaults("fluid.handlebars.inlineMessageBundlingMiddleware.request", {
    gradeNames: ["fluid.express.handler", "fluid.modelComponent"],
    defaultLocale: "{inlineMessageBundlingMiddleware}.options.defaultLocale",
    model: {
        messageBundles: "{inlineMessageBundlingMiddleware}.model.messageBundles"
    },
    messages: {
        noMessages: "No message bundles were found."
    },
    invokers: {
        "handleRequest": {
            funcName: "fluid.handlebars.inlineMessageBundlingMiddleware.request.sendResponse",
            args:     ["{that}"]
        }
    }
});

fluid.defaults("fluid.handlebars.inlineMessageBundlingMiddleware", {
    gradeNames:          ["fluid.express.middleware.requestAware", "fluid.modelComponent"],
    defaultLocale:       "en_us",
    path:                "/messages",
    namespace:           "messages", // Namespace to allow other routers to put themselves in the chain before or after us.
    model: {
        messageBundles: {}
    },
    handlerGrades: ["fluid.handlebars.inlineMessageBundlingMiddleware.request"]
});
