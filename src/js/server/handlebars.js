/*

    Middleware that adds Handlebars rendering to a `gpii.express` instance.  See the docs for details:

    https://github.com/GPII/gpii-handlebars/blob/master/docs/handlebars.md

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.hb");

require("handlebars");
require("./lib/first-matching-path");
require("./lib/resolver");
require("./standaloneRenderer");
require("./watcher");

var path = require("path");

gpii.express.hb.engine = function (that, templatePath, templateContext, callback) {
    try {
        var templateKey = path.basename(templatePath, ".handlebars");
        var renderedContent = that.renderer.renderWithLayout(templateKey, templateContext);
        return callback(null, renderedContent);
    }
    catch (error) {
        return callback(error);
    }
};

gpii.express.hb.configureExpress = function (that, expressComponent) {
    var resolvedTemplateDirs = gpii.express.hb.resolveAllPaths(that.options.templateDirs);
    if (resolvedTemplateDirs.length > 0) {
        expressComponent.express.set("views", resolvedTemplateDirs);
        expressComponent.express.engine("handlebars", that.engine);
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
    components: {
        renderer: {
            type: "gpii.handlebars.standaloneRenderer",
            options: {
                templateDirs: "{gpii.express.hb}.options.templateDirs",
                components: {
                    initBlock: {
                        type: "gpii.handlebars.helper.initBlock"
                    }
                }
            }
        }
    },
    invokers: {
        engine: {
            funcName: "gpii.express.hb.engine",
            args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // templatePath, templateContext, callback
        }
    },
    listeners: {
        "{gpii.express}.events.onStarted": {
            funcName: "gpii.express.hb.configureExpress",
            args:     ["{that}", "{gpii.express}"]
        }
    }
});

fluid.registerNamespace("gpii.express.hb.live");

/*

    A grade that reloads the list of templates whenever there are filesystem changes.  See: https://issues.gpii.net/browse/GPII-2474

 */
fluid.defaults("gpii.express.hb.live", {
    gradeNames: ["gpii.express.hb"],
    events: {
        onWatcherReady: null,
        onFsChange: null
    },
    components: {
        watcher: {
            type: "gpii.handlebars.watcher",
            options: {
                watchDirs: "{gpii.express.hb}.options.templateDirs",
                listeners: {
                    "onFsChange.notifyParent": {
                        func: "{gpii.express.hb.live}.events.onFsChange.fire"
                    },
                    "onReady.notifyParent": {
                        func: "{gpii.express.hb.live}.events.onWatcherReady.fire"
                    }
                }
            }

        }
    },
    listeners: {
        "onFsChange.reloadTemplates": {
            funcName: "gpii.handlebars.standaloneRenderer.loadTemplateDirs",
            args:     ["{renderer}"]
        }
    }
});
