// A module that add support for handlebars itself to an express module.
//
// This is designed to be used by adding it to a `gpii.express` instance as a child component.
//
// Any "helper" functions should extend the `gpii.express.helper` grade, and should be added as child components of an instance of this grade.
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.hb");

var exphbs = require("express-handlebars");

require("handlebars");
require("./lib/first-matching-path");

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
    if (expressComponent.views) {
        // Add any partial directories we find.
        var partialsDirs = [];
        fluid.each(expressComponent.views, function (viewDir) {
            // We add entries in reverse order to preserve the same inheritance we see with pages.
            partialsDirs.unshift(viewDir + "/partials/");
        });

        // We can only use the first layouts directory until this issue is resolved in express-handlebars:
        //
        // https://github.com/ericf/express-handlebars/issues/112
        var layoutDir = fluid.find(expressComponent.views, gpii.express.hb.getPathSearchFn("layouts"));

        var handlebarsConfig = {
            defaultLayout: "main",
            layoutsDir:    layoutDir,
            partialsDir:   partialsDirs
        };

        handlebarsConfig.helpers = that.helpers;

        expressComponent.express.set("views", expressComponent.views);

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
    members: {
        helpers: {}
    },
    model: {},    // We should have an empty model, as the dispatcher expects to expose that.
    distributeOptions: [
        {
            record: {
                "funcName": "gpii.express.addHelper",
                "args": ["{gpii.express.hb}", "{gpii.templates.helper}"]
            },
            target: "{that > gpii.templates.helper}.options.listeners.onCreate"
        }
    ],
    components: {
        md: {
            type: "gpii.templates.helper.md.server"
        },
        equals: {
            type: "gpii.templates.helper.equals"
        },
        jsonify: {
            type: "gpii.templates.helper.jsonify"
        },
        initBlock: {
            type: "gpii.templates.helper.initBlock"
        }
    },
    listeners: {
        "{gpii.express}.events.onStarted": {
            funcName: "gpii.express.configureExpress",
            args:     ["{that}", "{gpii.express}"]
        }
    }
});