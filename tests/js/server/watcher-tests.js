/*

    Tests for the chokidar-based filesystem watcher used to load/unload templates when they are added/changed/removed.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../src/js/server/watcher");

var jqUnit = require("node-jqunit");
var fs     = require("fs");
var os     = require("os");
var path   = require("path");
var rimraf = require("rimraf");
var mkdirp = require("mkdirp");

fluid.registerNamespace("gpii.tests.handlebars.watcher");

gpii.tests.handlebars.watcher.generateUniqueTmpDir = function (that) {
    var tmpDir = os.tmpdir();
    return path.resolve(tmpDir, "watcher-test-dir-" + that.id);
};

gpii.tests.handlebars.watcher.init = function (that) {
    var resolvedPaths = fluid.transform(fluid.makeArray(that.options.watchDirs), fluid.module.resolvePath);

    var initPromises = [];
    fluid.each(resolvedPaths, function (watchDir) {
        initPromises.push(function () {
            var initPromise = fluid.promise();
            mkdirp(watchDir, function (error) {
                if (error) {
                    initPromise.reject(error);
                }
                else {
                    initPromise.resolve();
                }
            });
            return initPromise;
        });
    });

    var initSequence = fluid.promise.sequence(initPromises);
    initSequence.then(
        function () {
            fluid.log("Created temporary directories, proceeding with normal startup...");
            gpii.handlebars.watcher.init(that);
        },
        fluid.fail
    );
};

gpii.tests.handlebars.watcher.cleanup = function (that) {
    // Perform the default cleanup actions
    gpii.handlebars.watcher.cleanup(that);

    // Remove our temporary content
    var promises = [];
    fluid.each(fluid.makeArray(that.options.watchDirs), function (watchDir) {
        promises.push(function () {
            var promise = fluid.promise();
            var resolvedDirPath = fluid.module.resolvePath(watchDir);
            rimraf(resolvedDirPath, function (error) {
                if (error) {
                    promise.reject(error);
                }
                else {
                    promise.resolve();
                }
            });
            return promise;
        });
    });

    var sequence = fluid.promise.sequence(promises);
    sequence.then(
        function () { fluid.log("Temporary content removed..."); },
        fluid.fail
    );
};

fluid.defaults("gpii.tests.handlebars.watcher", {
    gradeNames: ["gpii.handlebars.watcher"],
    myTmpDir:  "@expand:gpii.tests.handlebars.watcher.generateUniqueTmpDir({that})",
    watchDirs: ["{that}.options.myTmpDir"],
    listeners: {
        "onCreate.init": {
            funcName: "gpii.tests.handlebars.watcher.init",
            args:     ["{that}"]
        },
        "onDestroy.cleanup": {
            funcName: "gpii.tests.handlebars.watcher.cleanup",
            args:     ["{that}"]
        }
    }
});

jqUnit.asyncTest("We should be able to detect a file that has been added...", function () {
    var watcherComponent = gpii.tests.handlebars.watcher({});

    var newFilePath = path.resolve(watcherComponent.options.watchDirs[0], "newfile.txt");

    watcherComponent.events.onFsChange.addListener(function (eventName, path) {
        jqUnit.start();
        jqUnit.assertEquals("A file 'add' event should have been fired...", "add", eventName);
        jqUnit.assertEquals("The path should be correct...", newFilePath, path);
        watcherComponent.destroy();
    });

    watcherComponent.events.onReady.addListener(function () {
        fluid.log("Adding new file '", newFilePath, "'...");
        fs.writeFileSync(newFilePath, "This is new file content.");
    });
});

jqUnit.asyncTest("We should be able to detect a file that has been changed...", function () {
    var watcherComponent = gpii.tests.handlebars.watcher({});

    var toBeChanged = path.resolve(watcherComponent.options.watchDirs[0], "to-be-changed.txt");

    watcherComponent.events.onReady.addListener(function () {
        // Create the file before listening to changes.
        fs.writeFileSync(toBeChanged, "Unchanged.");

        // Because awaitWriteFinish is set, we need to give the above add ~2 seconds to complete before listening for and then making a change.
        setTimeout(function () {
            watcherComponent.events.onFsChange.addListener(function (eventName, path) {
                jqUnit.start();
                jqUnit.assertEquals("A file 'change' event should have been fired...", "change", eventName);
                jqUnit.assertEquals("The path should be correct...", toBeChanged, path);
                watcherComponent.destroy();
            });

            fluid.log("Updating file '", toBeChanged, "'...");
            fs.writeFileSync(toBeChanged, "Updated.");
        }, 2500);


    });
});

jqUnit.asyncTest("We should be able to detect a file that has been deleted...", function () {
    var watcherComponent = gpii.tests.handlebars.watcher({});

    var toBeDeleted = path.resolve(watcherComponent.options.watchDirs[0], "to-be-deleted.txt");

    watcherComponent.events.onReady.addListener(function () {
        // Create the file before listening to changes.
        fs.writeFileSync(toBeDeleted, "Don't get comfortable.");

        // Because awaitWriteFinish is set, we need to give the above add ~2 seconds to complete before listening for and then making a change.
        setTimeout(function () {
            watcherComponent.events.onFsChange.addListener(function (eventName, path) {
                jqUnit.start();
                jqUnit.assert("A file 'unlink' event should have been fired...", "unlink", eventName);
                jqUnit.assertEquals("The path should be correct...", toBeDeleted, path);
                watcherComponent.destroy();
            });

            fluid.log("Removing file '", toBeDeleted, "'...");
            fs.unlinkSync(toBeDeleted);
        }, 2500);
    });
});
