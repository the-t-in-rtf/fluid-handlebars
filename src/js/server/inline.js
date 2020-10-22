/*

    Middleware that combines all available Handlebars templates into a single bundle that can be downloaded and used
    by the client-side renderer.  For more information, see the docs:

    https://github.com/fluid-project/fluid-handlebars/blob/main/docs/inline.md

 */
/* eslint-env node */
"use strict";
var fluid  = require("infusion");
fluid.registerNamespace("fluid.handlebars.inlineTemplateBundlingMiddleware");

var fs     = require("fs");
var path   = require("path");
var md5    = require("md5");

require("./lib/resolver");

fluid.registerNamespace("fluid.handlebars.inlineTemplateBundlingMiddleware.request");
fluid.handlebars.inlineTemplateBundlingMiddleware.request.sendResponse = function (that) {
    if (that.options.templates) {
        var md5Sum = md5(JSON.stringify(that.options.templates));
        // Always set the "etag" header so that we always have something to compare for each subsequent request.
        that.options.response.set("ETag", md5Sum);

        if (that.options.request.headers["if-none-match"] === md5Sum) {
            // A 304 response should not send a message body.  See https://httpstatuses.com/304 for an explanation (includes links to the relevant RFC as well).
            that.options.response.status(304).end();
        }
        else {
            fluid.express.handler.sendResponse(that, that.options.response, 200, that.options.templates);
        }
    }
    else {
        fluid.express.handler.sendResponse(that, that.options.response, 500, { isError: true, message: that.options.messages.noTemplates});
    }
};

fluid.defaults("fluid.handlebars.inlineTemplateBundlingMiddleware.request", {
    gradeNames: ["fluid.express.handler"],
    templates: "{inlineTemplateBundlingMiddleware}.templates",
    messages: {
        noTemplates: "No templates were found."
    },
    invokers: {
        "handleRequest": {
            funcName: "fluid.handlebars.inlineTemplateBundlingMiddleware.request.sendResponse",
            args:     ["{that}"]
        }
    }
});

fluid.handlebars.inlineTemplateBundlingMiddleware.loadTemplates =  function (that) {
    // Clear out the existing template content, as we might also be called during a "reload".
    fluid.each(["layouts", "pages", "partials"], function (key) {
        that.templates[key] = {};
    });

    var resolvedTemplateDirs = fluid.handlebars.resolvePrioritisedPaths(that.options.templateDirs);
    fluid.each(resolvedTemplateDirs, function (templateDir) {
        // Start with each "views" directory and work our way down
        var dirContents = fs.readdirSync(templateDir);
        dirContents.forEach(function (entry) {
            var subDirPath = path.resolve(templateDir, entry);
            var stats = fs.statSync(subDirPath);
            if (stats.isDirectory() && that.options.allowedTemplateDirs.indexOf(entry) !== -1) {
                fluid.handlebars.inlineTemplateBundlingMiddleware.scanTemplateSubdir(that, entry, subDirPath);
            }
        });
    });

    that.events.templatesLoaded.fire(that);
};

fluid.handlebars.inlineTemplateBundlingMiddleware.scanTemplateSubdir = function (that, key, dirPath) {
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

fluid.defaults("fluid.handlebars.inlineTemplateBundlingMiddleware", {
    gradeNames:          ["fluid.express.middleware.requestAware"],
    path:                "/templates",
    namespace:           "templates", // Namespace to allow other routers to put themselves in the chain before or after us.
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
        loadTemplates: null,
        templatesLoaded: null
    },
    handlerGrades: ["fluid.handlebars.inlineTemplateBundlingMiddleware.request"],
    listeners: {
        "onCreate.loadTemplates": {
            func: "{that}.events.loadTemplates.fire"
        },
        "loadTemplates.loadTemplates": {
            funcName: "fluid.handlebars.inlineTemplateBundlingMiddleware.loadTemplates",
            args:     ["{that}"]
        }
    }
});
