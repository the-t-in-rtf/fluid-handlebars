/*

    Middleware that adds Handlebars rendering to a `gpii.express` instance.  See the docs for details:

    https://github.com/GPII/gpii-handlebars/blob/master/docs/handlebars.md

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.hb");

var exphbs = require("express-handlebars");

require("handlebars");
require("./lib/first-matching-path");
require("./lib/resolver");

gpii.express.addHelper = function (that, component) {
    var key = component.options.helperName;
    if (component.getHelper) {
        that.helpers[key] = component.getHelper();
    }
    else {
        fluid.fail("Can't register helper '" + key + "' because it doesn't have a getHelper() invoker.");
    }
};

gpii.express.configureExpress = function (that, expressComponent) {
    var resolvedTemplateDirs = gpii.express.hb.resolveAllPaths(that.options.templateDirs);

    if (resolvedTemplateDirs.length > 0) {
        // Add any partial directories we find.
        var partialsDirs = [];
        fluid.each(resolvedTemplateDirs, function (viewDir) {
            // We add entries in reverse order to preserve the same inheritance we see with pages.
            partialsDirs.unshift(viewDir + "/partials/");
        });

        // We can only use the first layouts directory until this issue is resolved in express-handlebars:
        //
        // https://github.com/ericf/express-handlebars/issues/112
        var layoutDir = fluid.find(resolvedTemplateDirs, gpii.express.hb.getPathSearchFn("layouts"));

        var handlebarsConfig = {
            defaultLayout: "main",
            layoutsDir:    layoutDir,
            partialsDir:   partialsDirs
        };

        handlebarsConfig.helpers = that.helpers;

        expressComponent.express.set("views", resolvedTemplateDirs);

        var hbs = exphbs.create(handlebarsConfig);
        expressComponent.express.engine("handlebars", hbs.engine);
        expressComponent.express.set("view engine", "handlebars");
    }
    else {
        fluid.fail("Cannot initialize template handling unless at least one template directory location is configured...");
    }
};

fluid.defaults("gpii.express.hb", {
    gradeNames:       ["fluid.modelComponent"],
    config:           "{expressConfigHolder}.options.config",
    namespace:        "handlebars", // Namespace to allow other middleware to put themselves in the chain before or after us.
    members: {
        helpers: {},
        templateDirs: []
    },
    model: {},    // We should have an empty model, as the dispatcher expects to expose that.
    distributeOptions: [
        {
            record: {
                "funcName": "gpii.express.addHelper",
                "args": ["{gpii.express.hb}", "{gpii.handlebars.helper}"]
            },
            target: "{that > gpii.handlebars.helper}.options.listeners.onCreate"
        }
    ],
    components: {
        md: {
            type: "gpii.handlebars.helper.md.server"
        },
        equals: {
            type: "gpii.handlebars.helper.equals"
        },
        jsonify: {
            type: "gpii.handlebars.helper.jsonify"
        },
        initBlock: {
            type: "gpii.handlebars.helper.initBlock"
        }
    },
    listeners: {
        "{gpii.express}.events.onStarted": {
            funcName: "gpii.express.configureExpress",
            args:     ["{that}", "{gpii.express}"]
        }
    }
});
