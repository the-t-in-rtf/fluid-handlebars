/*

    A "watcher" that looks for changes in one or more directories and fires an `onFsChange` event if:

    1. Existing files change.
    2. Files are added.
    3. Files are removed.
    4. Files are renamed.

    Based on chokidar: https://github.com/paulmillr/chokidar

 */
// TODO: Discuss (with Antranig) moving this to its own micro-module if it's more broadly useful.
/* eslint-env node */
"use strict";
var fluid = require("infusion");

var chokidar = require("chokidar");

require("./lib/resolver");

fluid.registerNamespace("fluid.handlebars.watcher");

/*

    Initialize our chokidar "watcher" and bind to its events.

 */
fluid.handlebars.watcher.init = function (that) {
    var resolvedDirs = fluid.handlebars.resolvePrioritisedPaths(that.options.watchDirs);

    that.watcher = chokidar.watch(resolvedDirs, that.options.chokidarOptions);

    fluid.each(that.options.eventsToWatch, function (eventEnabled, eventName) {
        if (eventEnabled) {
            // Pass the event type (chokidar only does this for the "all" event type).
            that.watcher.on(eventName, function (path, details) {
                that.handleFsEvent(eventName, path, details);
            });
        }
    });

    // Once chokidar fires its own "ready" event, let everyone know that we're ready to start monitoring.
    that.watcher.on("ready", that.events.onReady.fire);
};


/*

    Handle a single filesystem event passed by chokidar's "watcher".

 */
fluid.handlebars.watcher.handleFsEvent = function (that, eventName, path, details) {
    that.events.onFsChange.fire(eventName, path, details);
};

/**
 *
 * Ensure that our filesystem watchers are cleanly closed before the component is destroyed.
 *
 * @param {Object} that - The watcher component.
 * @return {Promise} - A promise that will resolve when cleanup is complete.
 */
fluid.handlebars.watcher.cleanup = function (that) {
    return that.watcher.close();
};

fluid.defaults("fluid.handlebars.watcher", {
    gradeNames: ["fluid.component"],
    members: {
        watcher: null
    },
    // Watch for file adds, changes, and removals.
    "eventsToWatch": {
        "add":    true,
        "change": true,
        "unlink": true
    },
    watchDirs: {},
    // See: https://github.com/paulmillr/chokidar#api
    chokidarOptions: {
        ignoreInitial: true, // We do not want to detect files when starting up, only when they change after startup.
        awaitWriteFinish: false,
        depth: 2 // We are typically dealing with template directories that contain at most one level of subdirectories.
    },
    events: {
        onReady:    null,
        onFsChange: null
    },
    listeners: {
        "onCreate.init": {
            funcName: "fluid.handlebars.watcher.init",
            args:     ["{that}"]
        },
        "onDestroy.cleanup": {
            funcName: "fluid.handlebars.watcher.cleanup",
            args:     ["{that}"]
        },
        "onReady.log": {
            funcName: "fluid.log",
            args: ["Template change watcher ready..."]
        }
    },
    invokers: {
        "handleFsEvent": {
            funcName: "fluid.handlebars.watcher.handleFsEvent",
            args:     ["{that}", "{arguments}.0", "{arguments}.1", "{arguments}.2"] // event, path, details
        }
    }
});
