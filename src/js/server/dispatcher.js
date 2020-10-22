/*

    Middleware that renders a layout and/or page based on the URL path. For more information, see the docs:

    https://github.com/fluid-project/fluid-handlebars/blob/main/docs/dispatcher.md

 */
/* eslint-env node */
"use strict";
var fluid      = require("infusion");
fluid.registerNamespace("fluid.handlebars.dispatcherMiddleware");

require("./lib/first-matching-path");
require("./lib/resolver");

var path = require("path");

fluid.handlebars.dispatcherMiddleware.middleware = function (that, req, res, next) {
    var templateName     = req.params.template ? req.params.template : that.options.defaultTemplate;
    var resolvedTemplateDirs = fluid.handlebars.resolvePrioritisedPaths(that.options.templateDirs);

    var templateExists =  fluid.find(resolvedTemplateDirs, fluid.express.hb.getPathSearchFn(["pages", templateName + ".handlebars"]));
    if (templateExists) {
        var layoutExists    = fluid.find(resolvedTemplateDirs, fluid.express.hb.getPathSearchFn(["layouts", templateName + ".handlebars"]));
        var layoutName      = layoutExists ? templateName : that.options.defaultLayout;
        var contextToExpose = fluid.model.transformWithRules({ model: that.model, req: req, layout: layoutName }, that.options.rules.contextToExpose);
        // TODO: merge this with a message bundle specific to the user's request.
        res.status(200).render(path.join("pages", templateName), contextToExpose);
    }
    else {
        next({ isError: true, message: "The page you requested could not be found."});
    }
};


fluid.defaults("fluid.handlebars.dispatcherMiddleware", {
    gradeNames:      ["fluid.express.middleware", "fluid.modelComponent"],
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
            funcName: "fluid.handlebars.dispatcherMiddleware.middleware",
            args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"]
        }
    }
});
