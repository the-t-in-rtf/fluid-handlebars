/*

    Middleware that renders a layout and/or page based on the URL path. For more information, see the docs:

    https://github.com/GPII/gpii-handlebars/blob/master/docs/dispatcher.md

 */
/* eslint-env node */
"use strict";
var fluid      = require("infusion");
var gpii       = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.handlebars.dispatcherMiddleware");

require("./lib/first-matching-path");
require("./lib/resolver");

var path = require("path");

gpii.handlebars.dispatcherMiddleware.middleware = function (that, req, res, next) {
    var templateName     = req.params.template ? req.params.template : that.options.defaultTemplate;
    var resolvedTemplateDirs = gpii.handlebars.resolvePrioritisedPaths(that.options.templateDirs);

    var templateExists =  fluid.find(resolvedTemplateDirs, gpii.express.hb.getPathSearchFn(["pages", templateName + ".handlebars"]));
    if (templateExists) {
        var layoutExists    = fluid.find(resolvedTemplateDirs, gpii.express.hb.getPathSearchFn(["layouts", templateName + ".handlebars"]));
        var layoutName      = layoutExists ? templateName : that.options.defaultLayout;
        var contextToExpose = fluid.model.transformWithRules({ model: that.model, req: req, layout: layoutName }, that.options.rules.contextToExpose);
        // TODO: merge this with a message bundle specific to the user's request.
        res.status(200).render(path.join("pages", templateName), contextToExpose);
    }
    else {
        next({ isError: true, message: "The page you requested could not be found."});
    }
};


fluid.defaults("gpii.handlebars.dispatcherMiddleware", {
    gradeNames:      ["gpii.express.middleware", "fluid.modelComponent"],
    path:            ["/:template", "/"],
    namespace:       "dispatcher", // Namespace to allow other routers to put themselves in the chain before or after us.
    method:          "get",
    defaultTemplate: "index",
    defaultLayout:   "main",
    rules: {
        contextToExpose: {
            "layout": "layout", // This is required to support custom layouts
            "user":   "req.session.user",
            "req":  {
                "query":  "req.query",
                "params": "req.params"
            }
        }
    },
    invokers: {
        middleware: {
            funcName: "gpii.handlebars.dispatcherMiddleware.middleware",
            args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});
