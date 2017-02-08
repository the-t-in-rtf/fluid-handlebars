/*

    Middleware that combines all available Handlebars templates into a single bundle that can be downloaded and used
    by the client-side renderer.  For more information, see the docs:

    https://github.com/GPII/gpii-handlebars/blob/master/docs/inline.md

 */
/* eslint-env node */
"use strict";
var fluid  = require("infusion");
var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.handlebars.inlineTemplateBundlingMiddleware");
var fs     = require("fs");
var path   = require("path");

require("./lib/resolver");

fluid.registerNamespace("gpii.handlebars.inlineTemplateBundlingMiddleware.request");
gpii.handlebars.inlineTemplateBundlingMiddleware.request.sendResponse = function (that) {
    if (that.options.templates) {
        gpii.express.handler.sendResponse(that, that.options.response, 200, { ok: true, templates: that.options.templates });
    }
    else {
        gpii.express.handler.sendResponse(that, that.options.response, 500, { ok: false, message: that.options.messages.noTemplates});
    }
};

fluid.defaults("gpii.handlebars.inlineTemplateBundlingMiddleware.request", {
    gradeNames: ["gpii.express.handler"],
    templates: "{inline}.templates",
    messages: {
        noTemplates: "No templates were found."
    },
    invokers: {
        "handleRequest": {
            funcName: "gpii.handlebars.inlineTemplateBundlingMiddleware.request.sendResponse",
            args:     ["{that}"]
        }
    }
});

gpii.handlebars.inlineTemplateBundlingMiddleware.loadTemplates =  function (that) {
    var resolvedTemplateDirs = gpii.express.hb.resolveAllPaths(that.options.templateDirs);

    fluid.each(resolvedTemplateDirs, function (templateDir) {
        // Start with each "views" directory and work our way down
        var dirContents = fs.readdirSync(templateDir);
        dirContents.forEach(function (entry) {
            var subDirPath = path.resolve(templateDir, entry);
            var stats = fs.statSync(subDirPath);
            if (stats.isDirectory() && that.options.allowedTemplateDirs.indexOf[entry] !== -1) {
                gpii.handlebars.inlineTemplateBundlingMiddleware.scanTemplateSubdir(that, entry, subDirPath);
            }
        });
    });

    that.events.templatesLoaded.fire(that);
};

gpii.handlebars.inlineTemplateBundlingMiddleware.scanTemplateSubdir = function (that, key, dirPath) {
    var dirContents = fs.readdirSync(dirPath);
    dirContents.forEach(function (entry) {
        var entryPath = path.resolve(dirPath, entry);
        var stats = fs.statSync(entryPath);
        if (stats.isFile()) {
            var matches = that.options.hbsExtensionRegexp.exec(entry);
            if (matches) {
                var templateName = matches[1];
                if (!that.templates[key][templateName]) {
                    var templateContent = fs.readFileSync(entryPath, {encoding: "utf8"});
                    that.templates[key][templateName] = templateContent;
                }
            }
        }
    });
};

fluid.defaults("gpii.handlebars.inlineTemplateBundlingMiddleware", {
    gradeNames:          ["gpii.express.middleware.requestAware"],
    path:                "/inline",
    namespace:           "inline", // Namespace to allow other routers to put themselves in the chain before or after us.
    hbsExtensionRegexp:  /^(.+)\.(?:hbs|handlebars)$/,
    allowedTemplateDirs: ["layouts", "partials", "pages"],
    members: {
        templates: {
            layouts:  {},
            pages:    {},
            partials: {}
        }
    },
    events: {
        templatesLoaded: null
    },
    handlerGrades: ["gpii.handlebars.inlineTemplateBundlingMiddleware.request"],
    listeners: {
        "onCreate.loadTemplates": {
            funcName: "gpii.handlebars.inlineTemplateBundlingMiddleware.loadTemplates",
            args:     ["{that}"]
        }
    }
});
