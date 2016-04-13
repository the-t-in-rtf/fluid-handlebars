/*
    This component is designed to feed template content stored on the server to the client-side components included
    with this library.

    This component requires the full path to all template content.  That path is expected to point to a directory
    that follows the handlebars conventions, and stores template content in subdirectories based on the type of template
    (`layouts`, `pages`, and `partials`).  Any content found in these subdirectories will be read and stored in the
    `templates` member object using the template directory name and the filename (minus the handlebars suffix).

    Say that we have a views directory that contains a `pages` subdirectory, and that the `pages` subdirectory contains
    a single template, called `myTemplate.handlebars`.  When `loadTemplates` finishes running, the `templates` member
    object should look like:

     {
       pages: {
         myTemplate: "..." // template content omitted for brevity
       }
     }

     With the data this router supplies, the handlebars client has what it needs to load partials and handle updating
     markup on the client side.
 */

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
        gpii.express.handler.sendResponse(that, that.response, 200, { ok: true, templates: that.options.templates });
    }
    else {
        gpii.express.handler.sendResponse(that, that.response, 500, { ok: false, message: that.options.messages.noTemplates});
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