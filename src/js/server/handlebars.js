/*

    Middleware that adds Handlebars rendering to a `fluid.express` instance.  See the docs for details:

    https://github.com/fluid-project/fluid-handlebars/blob/master/docs/handlebars.md

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
fluid.registerNamespace("fluid.express.hb");

require("handlebars");
require("./lib/first-matching-path");
require("./lib/resolver");
require("./standaloneRenderer");
require("./watcher");

var path = require("path");

fluid.express.hb.engine = function (that, templatePath, templateContext, callback) {
    try {
        var templateKey = path.basename(templatePath, ".handlebars");
        var renderedContent = that.renderer.renderWithLayout(templateKey, templateContext);
        return callback(null, renderedContent);
    }
    catch (error) {
        return callback(error);
    }
};

fluid.express.hb.configureExpress = function (that, expressComponent) {
    var resolvedTemplateDirs = fluid.handlebars.resolvePrioritisedPaths(that.options.templateDirs);
    if (resolvedTemplateDirs.length > 0) {
        expressComponent.express.set("views", resolvedTemplateDirs);
        expressComponent.express.engine("handlebars", that.engine);
        expressComponent.express.set("view engine", "handlebars");
    }
    else {
        fluid.fail("Cannot initialize template handling unless at least one template directory location is configured...");
    }
};

fluid.defaults("fluid.express.hb", {
    gradeNames:       ["fluid.modelComponent"],
    config:           "{expressConfigHolder}.options.config",
    namespace:        "handlebars", // Namespace to allow other middleware to put themselves in the chain before or after us.
    model: {
        messageBundles: {}
    },
    components: {
        renderer: {
            type: "fluid.handlebars.standaloneRenderer",
            options: {
                templateDirs: "{fluid.express.hb}.options.templateDirs",
                model: {
                    messageBundles: "{fluid.express.hb}.model.messages"
                },
                components: {
                    initBlock: {
                        type: "fluid.handlebars.helper.initBlock"
                    }
                }
            }
        }
    },
    invokers: {
        engine: {
            funcName: "fluid.express.hb.engine",
            args: ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // templatePath, templateContext, callback
        }
    },
    listeners: {
        "{fluid.express}.events.onStarted": {
            funcName: "fluid.express.hb.configureExpress",
            args:     ["{that}", "{fluid.express}"]
        }
    }
});

fluid.registerNamespace("fluid.express.hb.live");

/*

    A grade that reloads the list of templates whenever there are filesystem changes.  See: https://issues.fluid.net/browse/fluid-2474

 */
fluid.defaults("fluid.express.hb.live", {
    gradeNames: ["fluid.express.hb"],
    events: {
        onWatcherReady: null,
        onFsChange: null
    },
    components: {
        watcher: {
            type: "fluid.handlebars.watcher",
            options: {
                watchDirs: "{fluid.express.hb}.options.templateDirs",
                listeners: {
                    "onFsChange.notifyParent": {
                        func: "{fluid.express.hb.live}.events.onFsChange.fire"
                    },
                    "onReady.notifyParent": {
                        func: "{fluid.express.hb.live}.events.onWatcherReady.fire"
                    }
                }
            }

        }
    },
    listeners: {
        "onFsChange.reloadTemplates": {
            funcName: "fluid.handlebars.standaloneRenderer.loadTemplateDirs",
            args:     ["{renderer}"]
        }
    }
});
