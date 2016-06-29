/*
  A fluid-component for use with express.js that routes requests to the appropriate layout and page (if available).

  The data exposed to handlebars is controlled using the transformation rules found in `options.rules.contextToExpose`.

  By default, the request object is exposed.  To disable this, you will need to use a configuration block like:

  rules: {
    contextToExpose: {
      req: "notfound" // point to a variable that does not exist to remove this from the results
    }
  }

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
    var template     = req.params.template ? req.params.template : that.options.defaultTemplate;
    var templateName = template + ".handlebars";


    var resolvedTemplateDirs = gpii.express.hb.resolveAllPaths(that.options.templateDirs);

    var templateExists =  fluid.find(resolvedTemplateDirs, gpii.express.hb.getPathSearchFn(["pages", templateName]));
    if (templateExists) {
        var layoutExists    = fluid.find(resolvedTemplateDirs, gpii.express.hb.getPathSearchFn(["layouts", templateName]));
        var layoutName      = layoutExists ? templateName : that.options.defaultLayout;
        var contextToExpose = fluid.model.transformWithRules({ model: that.model, req: req, layout: layoutName }, that.options.rules.contextToExpose);
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
    defaultLayout:   "main.handlebars",
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
