// A standalone handlebars renderer designed for use in rendering mail templates.
//
// Although this does not itself require express, it can work with any helper functions that extend the
// `gpii.express.helper` grade, but which do not themselves require express.
//
// The directory conventions used with express are partially supported, as follows:
//
//  1. Any templates in the `partials` subdirectory relative to `options.templateDir` will be registered as partials for use in `{{>partial}}` statements.
//  2. All other templates are expected to be stored in a `pages` subdirectory relative to `options.templateDir`.
//
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.handlebars.standaloneRenderer");

var handlebars = require("handlebars");

var fs   = require("fs");
var path = require("path");

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
    if (!that.options.templateDir) {
        fluid.fail("Cannot initialize template handling without a 'templateDir' option...");
    }
    else {
        var templateDirs = fluid.makeArray(that.options.templateDir);
        fluid.each(templateDirs, function (templateDir) {
            // Register all partials found in the "partials" subdirectory relative to `options.templateDir`;
            var partialDir = path.resolve(templateDir, "partials");
            fluid.each(fs.readdirSync(partialDir), function (filename) {
                var partialPath = path.resolve(partialDir, filename);
                var partialContent = fs.readFileSync(partialPath, "utf8");
                var templateKey = filename.replace(/\.(handlebars|hbs)$/i, "");
                handlebars.registerPartial(templateKey, partialContent);
            });

            // Register all helper modules (child components of this module).
            fluid.each(that.helpers, function (fn, key) {
                handlebars.registerHelper(key, fn);
            });
        });
    }
};

gpii.handlebars.standaloneRenderer.render = function (that, templateKey, context) {
    if (!that.compiledTemplates[templateKey]) {
        var templateDirs = fluid.makeArray(that.options.templateDir);
        var templatePath = false;
        fluid.each(templateDirs, function (templateDir) {
            var candidatePath = path.resolve(templateDir, "./pages", templateKey + that.options.handlebarsSuffix);
            if (fs.existsSync(candidatePath)) {
                templatePath = candidatePath;
            }
        });
        if (templatePath) {
            var templateContent = fs.readFileSync(templatePath, "utf8");
            that.compiledTemplates[templateKey] = handlebars.compile(templateContent);
        }
        else {
            fluid.fail("Can't find template '" + templateKey + "' in any of your template directories...");
        }
    }

    var template = that.compiledTemplates[templateKey];
    return template(context);
};

fluid.defaults("gpii.handlebars.standaloneRenderer", {
    gradeNames: ["fluid.modelComponent"],
    members: {
        helpers:           {},
        compiledTemplates: {}
    },
    handlebarsSuffix: ".handlebars",
    distributeOptions: [
        {
            record: {
                "funcName": "gpii.handlebars.standaloneRenderer.addHelper",
                "args": ["{gpii.handlebars.standaloneRenderer}", "{gpii.templates.helper}"]
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
        }
    },
    invokers: {
        render: {
            funcName: "gpii.handlebars.standaloneRenderer.render",
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