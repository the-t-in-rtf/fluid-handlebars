/*

    Our common handlebars renderer, used for rendering mail templates as well as within our own Express view engine.

    See the docs for details: https://github.com/GPII/gpii-handlebars/blob/master/docs/standaloneRenderer.md

*/
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.handlebars.standaloneRenderer");

var handlebars = require("handlebars");

var fs   = require("fs");
var path = require("path");

require("gpii-express"); // required to pick up `resolvePaths` function used below.

gpii.handlebars.standaloneRenderer.addHelper = function (that, component) {
    var key = component.options.helperName;
    if (component.getHelper) {
        that.helpers[key] = component.getHelper();
    }
    else {
        fluid.fail("Can't register helper '" + key + "' because it doesn't have a getHelper() invoker.");
    }
};

gpii.handlebars.standaloneRenderer.init = function (that) {
    // Get rid of any existing compiled templates.
    that.compiledTemplates = [];

    // As with gradeNames, the right-most template directory that contains a given partial "wins".
    fluid.each(that.templateDirs.reverse(), function (templateDir) {
        // Register all partials found in the "partials" subdirectory relative to `options.templateDirs`;
        var partialDir = path.resolve(templateDir, "partials");
        fluid.each(fs.readdirSync(partialDir), function (filename) {
            var partialPath = path.resolve(partialDir, filename);
            var partialContent = fs.readFileSync(partialPath, "utf8");
            var templateKey = filename.replace(/\.(handlebars|hbs)$/i, "");
            handlebars.registerPartial(templateKey, partialContent);
        });
    });

    // Register all helper modules (child components of this module).
    fluid.each(that.helpers, function (fn, key) {
        handlebars.registerHelper(key, fn);
    });

    that.events.onTemplatesLoaded.fire();
};

gpii.handlebars.standaloneRenderer.getLayoutPathFromKey = function (that, layoutKey) {
    return gpii.handlebars.standaloneRenderer.getPathFromSegmentAndKey(that, "layouts", layoutKey);
};

gpii.handlebars.standaloneRenderer.getPagePathFromKey = function (that, pageKey) {
    return gpii.handlebars.standaloneRenderer.getPathFromSegmentAndKey(that, "pages", pageKey);
};


gpii.handlebars.standaloneRenderer.getPathFromSegmentAndKey = function (that, segment, key) {
    var path = fluid.find(fluid.makeArray(that.options.templateDirs), gpii.express.hb.getPathSearchFn([segment, key]));
    if (path) {
        return path;
    }
    else {
        fluid.fail("Can't find '" + key + "' in any '" + segment + "' view subdirectory...");
    }
};


gpii.handlebars.standaloneRenderer.render = function (that, pageTemplatePath, context) {
    var pageTemplate = gpii.handlebars.standaloneRenderer.getTemplate(that, pageTemplatePath);
    return pageTemplate(context);
};

gpii.handlebars.standaloneRenderer.renderWithLayout = function (that, pageTemplatePath, context) {
    // Render the page body first.
    var pageBody = that.render(pageTemplatePath, context);

    var layoutContext = fluid.extend({}, context, { body: pageBody});

    // Render the page body in the selected layout (or the default if none is selected).
    var layoutTemplateKey = context.layout ? context.layout : that.options.defaultLayout;
    var layoutTemplateKeyWithExtension = gpii.handlebars.standaloneRenderer.addExtensionIfNeeded(that, layoutTemplateKey);
    var layoutTemplatePath  = gpii.handlebars.standaloneRenderer.getLayoutPathFromKey(that, layoutTemplateKeyWithExtension);
    var layoutTemplate = gpii.handlebars.standaloneRenderer.getTemplate(that, layoutTemplatePath);

    return layoutTemplate(layoutContext);
};

gpii.handlebars.standaloneRenderer.resolvePath = function (that, fullOrPartialPath) {
    var pathWithExtension = gpii.handlebars.standaloneRenderer.addExtensionIfNeeded(that, fullOrPartialPath);
    var resolvedFullPath = fluid.module.resolvePath(pathWithExtension);
    if (fs.existsSync(resolvedFullPath)) {
        return resolvedFullPath;
    }
    else {
        return gpii.handlebars.standaloneRenderer.getPagePathFromKey(that, pathWithExtension);
    }
};

gpii.handlebars.standaloneRenderer.addExtensionIfNeeded = function (that, path) {
    var extensionPattern = new RegExp("\." + that.options.handlebarsExtension + "$");
    return path.match(extensionPattern) ? path : path + "." + that.options.handlebarsExtension;
};

gpii.handlebars.standaloneRenderer.getTemplate = function (that, templatePath) {
    var resolvedPath = gpii.handlebars.standaloneRenderer.resolvePath(that, templatePath);

    if (!that.compiledTemplates[resolvedPath]) {
        var templateContent = fs.readFileSync(resolvedPath, "utf8");
        that.compiledTemplates[resolvedPath] = handlebars.compile(templateContent);
    }

    return that.compiledTemplates[resolvedPath];
};

fluid.defaults("gpii.handlebars.standaloneRenderer", {
    gradeNames: ["fluid.modelComponent"],
    defaultLayout: "main",
    handlebarsExtension: "handlebars",
    events: {
        onTemplatesLoaded: null
    },
    members: {
        helpers:           {},
        compiledTemplates: {},
        templateDirs: "@expand:gpii.express.expandPaths({that}.options.templateDirs)"
    },
    distributeOptions: [
        {
            record: {
                "funcName": "gpii.handlebars.standaloneRenderer.addHelper",
                "args": ["{gpii.handlebars.standaloneRenderer}", "{gpii.handlebars.helper}"]
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
        }
    },
    invokers: {
        render: {
            funcName: "gpii.handlebars.standaloneRenderer.render",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"] // templateName, context
        },
        renderWithLayout: {
            funcName: "gpii.handlebars.standaloneRenderer.renderWithLayout",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"] // templateName, context
        }
    },
    listeners: {
        "onCreate.init": {
            funcName: "gpii.handlebars.standaloneRenderer.init",
            args:     ["{that}"]
        }
    }
});
