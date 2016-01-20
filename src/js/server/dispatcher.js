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
"use strict";
var fluid      = require("infusion");
var gpii       = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.dispatcher");

require("./lib/first-matching-path");

var path       = require("path");

gpii.express.dispatcher.route = function (that, expressComponent, req, res) {
    var template     = req.params.template ? req.params.template : that.options.defaultTemplate;
    var templateName = template + ".handlebars";

    var layoutName   = templateName;

    var layoutExists   =  fluid.find(expressComponent.views, gpii.express.hb.getPathSearchFn(["layouts", templateName]));
    var templateExists =  fluid.find(expressComponent.views, gpii.express.hb.getPathSearchFn(["pages", templateName]));

    if (!layoutExists) {
        layoutName = that.options.defaultLayout;
    }

    if (!templateExists) {
        templateName = that.options.errorPage;
    }
    var rules           = templateExists ? that.options.rules.contextToExpose : that.options.rules.errorContext;
    var contextToExpose = fluid.model.transformWithRules({ model: that.model, req: req, layout: layoutName }, rules);
    var statusCode      = templateExists ? 200 : 404;

    res.status(statusCode).render(path.join("pages", templateName), contextToExpose);
};

fluid.defaults("gpii.express.dispatcher", {
    gradeNames:      ["gpii.express.router", "fluid.modelComponent"],
    method:          "get",
    defaultTemplate: "index",
    defaultLayout:   "main.handlebars",
    errorPage:       "error.handlebars",
    rules: {
        contextToExpose: {
            "layout": "layout", // This is required to support custom layouts
            "user":   "req.session.user",
            "req":  {
                "query":  "req.query",
                "params": "req.params"
            }
        },
        errorContext: {
            "layout": "layout", // This is required to support custom layouts
            message: {
                literalValue: "The page you requested was not found."
            }
        }
    },
    // In most cases you will want to supply both a path with a variable, and one without, as in:
    //
    // path:            ["/:template", "/"],
    //
    // This will ensure that the root content handling (which defaults to using `index.handlebars`) responds to the
    // root of the path.
    //
    invokers: {
        route: {
            funcName: "gpii.express.dispatcher.route",
            args: ["{that}", "{gpii.express}", "{arguments}.0", "{arguments}.1"]
        }
    }
});