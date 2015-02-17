/*
  A fluid-component for use with express.js that routes requests to the appropriate layout and page (if available).
 */
"use strict";
var fluid      = fluid || require('infusion');
var gpii       = fluid.registerNamespace("gpii");
var namespace  = "gpii.express.hb.dispatcher";
var dispatcher = fluid.registerNamespace(namespace);

var fs         = require("fs");

dispatcher.dispatchRouter = function(that, req, res) {
    var templateName = req.params.template;

    var viewDir      = that.options.config.express.views;
    var pagesDir     = viewDir + "/pages/";
    var layoutDir    = viewDir + "/layouts/";
    if (fs.existsSync(pagesDir + templateName + ".handlebars")) {
        // TODO:  Standardize handling of data to be exposed to the client and pass it here
        var filename   = fs.existsSync(layoutDir + templateName + ".handlebars") ? templateName : "main";

        var options    = JSON.parse(JSON.stringify(that.model));
        options.layout = layoutDir + filename + ".handlebars";
        options.req    = req;

        res.render(pagesDir + templateName + ".handlebars", options);
    }
    else {
        res.status(404).render(pagesDir + "error", {message: "The page you requested was not found."});
    }
};

dispatcher.addRoutesPrivate = function(that) {
    if (!that.options.path) {
        console.log("You must configure a model.path for a gpii.express.router grade...");
        return null;
    }
    if (!that.options.config || !that.options.config.express) {
        console.error("Can't instantiate router without a working config object in our model.")
        return null;
    }

    // Add support for passing a single additional parameter to a template.
    // This should should be available as req.params.code in the template itself.
    that.model.router.use(that.options.path +"/:template/:code", that.dispatchRouter);

    // Allow just using a template with no extra slash
    that.model.router.use(that.options.path +"/:template",       that.dispatchRouter);
};

fluid.defaults(namespace, {
    gradeNames: ["fluid.standardRelayComponent", "gpii.express.router", "autoInit"],
    path:   "/dispatcher",
    config: "{gpii.express}.options.config",
    events: {
        addRoutes: null
    },
    invokers: {
        "addRoutes": {
            funcName: namespace + ".addRoutesPrivate",
            args: ["{that}"]
        },
        "dispatchRouter": {
            "funcName": namespace + ".dispatchRouter",
            "args": [ "{that}", "{arguments}.0", "{arguments}.1"]
        }
    },
    listeners: {
        addRoutes: {
            listener: "{dispatcher}.addRoutes",
            args: ["{that}"]
        }
    }
});