/*

    Tests for the chokidar-based filesystem watcher used to load/unload templates when they are added/changed/removed.

 */
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

require("../../../src/js/server/watcher");

var jqUnit     = require("node-jqunit");
var os         = require("os");
var path       = require("path");
var rimraf     = require("rimraf");
var mkdirp     = require("mkdirp");
var fs         = require("fs");
var gracefulFs = require("graceful-fs");

gracefulFs.gracefulify(fs);

fluid.registerNamespace("gpii.tests.handlebars.watcher");

gpii.tests.handlebars.watcher.generateUniqueTmpDir = function (that) {
    var tmpDir = os.tmpdir();
    return path.resolve(tmpDir, "watcher-test-dir-" + that.id);
};

gpii.tests.handlebars.watcher.init = function (that) {
    var resolvedPaths = fluid.values(fluid.transform(that.options.watchDirs, fluid.module.resolvePath));

    var initPromises = [];
    fluid.each(resolvedPaths, function (watchDir) {
        initPromises.push(function () {
            fluid.log("Creating directory '", watchDir, "'...");
            var mkdirPromise = mkdirp(watchDir);
            return mkdirPromise;
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
    // Remove our temporary content
    var promises = [];
    var resolvedWatchDirs = gpii.handlebars.resolvePrioritisedPaths(that.options.watchDirs);

    fluid.each(resolvedWatchDirs, function (resolvedWatchdirPath) {
        promises.push(function () {
            var promise = fluid.promise();
            try {
                rimraf(resolvedWatchdirPath, function (error) {
                    if (error) {
                        fluid.log("CLEANUP ERROR:", error);
                        promise.resolve();
                    }
                    else {
                        promise.resolve();
                    }
                });
            }
            catch (thrownError) {
                fluid.log("CLEANUP EXCEPTION:", thrownError);
                promise.resolve();
            }
            return promise;
        });
    });

    var sequence = fluid.promise.sequence(promises);
    sequence.then(
        function () {
            gpii.handlebars.watcher.cleanup(that);
            fluid.log("Temporary content cleanup complete...");
        },
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

fluid.defaults("gpii.tests.handlebars.watcher.startSequenceElement", {
    gradeNames: "fluid.test.sequenceElement",
    sequence: [
        {
            func: "{gpii.tests.handlebars.watcher.environment}.events.createWatcher.fire"
        },
        {
            event:    "{gpii.tests.handlebars.watcher.environment}.events.watcherReady",
            listener: "fluid.identity"
        }
    ]
});

fluid.defaults("gpii.tests.handlebars.watcher.sequenceGrade", {
    gradeNames: "fluid.test.sequence",
    sequenceElements: {
        startWatcher: {
            gradeNames: "gpii.tests.handlebars.watcher.startSequenceElement",
            priority: "before:sequence"
        }
    }
});

fluid.defaults("gpii.tests.handlebars.watcher.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "File change 'watcher' tests.",
        tests: [
            {
                name: "We should be able to detect a file that has been added.",
                sequenceGrade: "gpii.tests.handlebars.watcher.sequenceGrade",
                sequence: [
                    {
                        func: "gpii.tests.handlebars.watcher.caseHolder.addFile",
                        args: ["{testEnvironment}.watcher", "newFile.txt"] // watcherComponent, filename
                    },
                    {
                        event:    "{testEnvironment}.events.onFsChange",
                        listener: "gpii.tests.handlebars.watcher.caseHolder.checkFsChangeResults",
                        args:     ["{testEnvironment}.watcher", "newFile.txt", "add", "{arguments}.0", "{arguments}.1"] // watcherComponent, filename, expectedEventName, eventName, eventFilePath
                    }
                ]
            },
            {
                name: "We should be able to detect a file that has been changed.",
                sequenceGrade: "gpii.tests.handlebars.watcher.sequenceGrade",
                sequence: [
                    {
                        func: "gpii.tests.handlebars.watcher.caseHolder.addFile",
                        args: ["{testEnvironment}.watcher", "changingFile.txt"] // watcherComponent, filename
                    },
                    {
                        event:     "{testEnvironment}.events.onFsChange",
                        listener:  "gpii.tests.handlebars.watcher.caseHolder.changeFile",
                        args:      ["{testEnvironment}.watcher", "changingFile.txt"] // watcherComponent, filename
                    },
                    {
                        event:    "{testEnvironment}.events.onFsChange",
                        listener: "gpii.tests.handlebars.watcher.caseHolder.checkFsChangeResults",
                        args:     ["{testEnvironment}.watcher", "changingFile.txt", "change", "{arguments}.0", "{arguments}.1"] // watcherComponent, filename, expectedEventName, eventName, eventFilePath
                    }
                ]
            },
            {
                name: "We should be able to detect a file that has been deleted.",
                sequenceGrade: "gpii.tests.handlebars.watcher.sequenceGrade",
                sequence: [
                    {
                        func: "gpii.tests.handlebars.watcher.caseHolder.addFile",
                        args: ["{testEnvironment}.watcher", "bornToDie.txt"] // watcherComponent, filename
                    },
                    {
                        event:     "{testEnvironment}.events.onFsChange",
                        listener:  "gpii.tests.handlebars.watcher.caseHolder.removeFile",
                        args:      ["{testEnvironment}.watcher", "bornToDie.txt"] // watcherComponent, filename
                    },
                    {
                        event:    "{testEnvironment}.events.onFsChange",
                        listener: "gpii.tests.handlebars.watcher.caseHolder.checkFsChangeResults",
                        args:     ["{testEnvironment}.watcher", "bornToDie.txt", "unlink", "{arguments}.0", "{arguments}.1"] // watcherComponent, filename, expectedEventName, eventName, eventFilePath
                    }
                ]
            },
            {
                name: "Large file writes should be handled correctly.",
                sequenceGrade: "gpii.tests.handlebars.watcher.sequenceGrade",
                sequence: [
                    {
                        func: "gpii.tests.handlebars.watcher.caseHolder.addLargeFile",
                        args: ["{testEnvironment}.watcher", "largeFile.txt"] // watcherComponent, filename
                    },
                    {
                        event:    "{testEnvironment}.events.onFsChange",
                        listener: "gpii.tests.handlebars.watcher.caseHolder.checkLargeFileChangeResults",
                        args:     ["{testEnvironment}.watcher", "largeFile.txt", "add", "{arguments}.0", "{arguments}.1"] // watcherComponent, filename, expectedEventName, eventName, eventFilePath
                    }
                ]
            }
        ]
    }]
});

gpii.tests.handlebars.watcher.caseHolder.checkFsChangeResults = function (watcherComponent, filename, expectedEventName, eventName, eventFilePath) {
    var expectedFilePath = path.resolve(watcherComponent.options.watchDirs[0], filename);

    jqUnit.assertEquals("The event name should be as expected.", expectedEventName, eventName);
    jqUnit.assertEquals("The path should be correct.", expectedFilePath, eventFilePath);
};

gpii.tests.handlebars.watcher.caseHolder.addFile = function (watcherComponent, filename) {
    var newFilePath = path.resolve(watcherComponent.options.watchDirs[0], filename);

    fluid.log("Adding new file '", newFilePath, "'.");
    fs.writeFileSync(newFilePath, "This is new file content.");
};

gpii.tests.handlebars.watcher.caseHolder.changeFile = function (watcherComponent, filename) {
    var toBeChanged = path.resolve(watcherComponent.options.watchDirs[0], filename);

    // Update the file
    fs.writeFileSync(toBeChanged, "Updated.");
};

gpii.tests.handlebars.watcher.caseHolder.removeFile = function (watcherComponent, filename) {
    var toBeDeleted = path.resolve(watcherComponent.options.watchDirs[0], filename);
    fs.unlinkSync(toBeDeleted);
};

gpii.tests.handlebars.watcher.caseHolder.addLargeFile = function (watcherComponent, filename) {
    var largeFilePath = path.resolve(watcherComponent.options.watchDirs[0], filename);

    fluid.log("Adding large file '", largeFilePath, "'.");
    fs.writeFileSync(largeFilePath, gpii.tests.handlebars.watcher.getLargeFilePayload());
};

gpii.tests.handlebars.watcher.getLargeFilePayload = function () {
    return (fluid.generate(1024 * 1024 * 25, "X")).join(""); // ~25Mb of "X" characters.
};

gpii.tests.handlebars.watcher.caseHolder.checkLargeFileChangeResults = function (watcherComponent, filename, expectedEventName, eventName, eventFilePath) {
    // Run the basic checks.
    gpii.tests.handlebars.watcher.caseHolder.checkFsChangeResults(watcherComponent, filename, expectedEventName, eventName, eventFilePath);

    // Additionally, check that the content was completely written.
    var largeFilePath = path.resolve(watcherComponent.options.watchDirs[0], filename);
    var fileContent = fs.readFileSync(largeFilePath, "utf8");
    var expectedFileContents = gpii.tests.handlebars.watcher.getLargeFilePayload();
    jqUnit.assertEquals("The file's contents should be correct...", expectedFileContents, fileContent);
};

fluid.defaults("gpii.tests.handlebars.watcher.environment", {
    gradeNames: ["fluid.test.testEnvironment"],
    events: {
        createWatcher: null,
        watcherReady:  null,
        onFsChange:    null
    },
    components: {
        caseHolder: {
            type: "gpii.tests.handlebars.watcher.caseHolder"
        },
        watcher: {
            type: "gpii.tests.handlebars.watcher",
            createOnEvent: "createWatcher",
            options: {
                listeners: {
                    "onReady.notifyParent": {
                        func: "{gpii.tests.handlebars.watcher.environment}.events.watcherReady.fire"
                    },
                    "onFsChange.notifyParent": {
                        func: "{gpii.tests.handlebars.watcher.environment}.events.onFsChange.fire"
                    }
                }
            }
        }
    }
});

fluid.test.runTests("gpii.tests.handlebars.watcher.environment");
