"use strict";
// This script will take one or more server-side template directories and inline their contents on a page.  Used to expose templates for client-side rendering.
var fluid  = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.express.hb.inline");
var fs     = require("fs");

gpii.express.hb.inline.loadTemplates =  function (that, dir, res) {
    var dirContents = fs.readdirSync(dir);
    dirContents.forEach(function (entry) {
        var path = dir + "/" + entry;
        var stats = fs.statSync(path);
        if (stats.isFile()) {
            var matches = that.options.hbsExtensionRegexp.exec(entry);
            if (matches) {
                var templateType = dir.indexOf("partials") !== -1 ? "partial" : "template";
                var key =  templateType + "-" + matches[1];

                // cache file information so that we only reload templates that have been updated
                if (that.cache[key] && stats.mtime.getTime() === that.cache[key].mtime.getTime()) {
                    //fluid.log("Skipping cached " + templateType + " '" + key + "'...");
                }
                else {
                    that.cache[key] = {
                        mtime: stats.mtime,
                        content: fs.readFileSync(path)
                    };
                    that.events.onUpdated.fire(that);
                }
            }
        }
        else if (stats.isDirectory()) {
            // call the function recursively for each directory
            gpii.express.hb.inline.loadTemplates(that, path, res);
        }
    });
};


gpii.express.hb.inline.wrapTemplate = function (that, key, content) {
    // We have to pseudo-escape script tags to avoid them breaking our templates.
    return "<script id=\"" + key + "\" type=\"text/x-handlebars-template\">" + content.toString().replace(that.options.hbsScriptRegexp, "{{!}}$1") + "</script>\n\n";
};

gpii.express.hb.inline.generateCachedHtml = function (that) {
    that.html = "";
    Object.keys(that.cache).forEach(function (key) {
        that.html += that.wrapTemplate(key, that.cache[key].content);
    });
};

gpii.express.hb.inline.getRouter = function (that) {
    return function (req, res) {
        gpii.express.hb.inline.loadTemplates(that, that.options.config.express.views, res);

        res.status(200).send(that.html);
    };
};

fluid.defaults("gpii.express.hb.inline", {
    gradeNames: ["gpii.express.router", "autoInit"],
    path:               "/inline",
    hbsExtensionRegexp: /^(.+)\.(?:hbs|handlebars)$/,
    hbsScriptRegexp:    /(script>)/g,
    members: {
        cache:              {},
        html:               ""
    },
    events: {
        addRoutes: null,
        onUpdated: null
    },
    invokers: {
        "getRouter": {
            funcName: "gpii.express.hb.inline.getRouter",
            args: ["{that}"]
        },
        "wrapTemplate": {
            funcName: "gpii.express.hb.inline.wrapTemplate",
            args: ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    },
    listeners: {
        "onUpdated": {
            funcName: "gpii.express.hb.inline.generateCachedHtml",
            args:     ["{that}"]
        }
    }
});