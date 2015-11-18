/*

    A wrapper grade that can be added to a test environment to make it:
    
    1. Create a promise when it is created.
    2. Fulfill that promise when it is destroyed.
    
    This grade is used to ensure that Zombie tests can be run in sequence (and that they can be run in combination with "normal" tests).

    Typically, you would instantiate a component that includes this grade which is assigned to a variable.  If you set
    `module.exports` to `component.afterDestroyPromise`, you can access the promise when requiring the test file.

 */

"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var when = require("when");

fluid.registerNamespace("gpii.templates.tests.promiseWrapper");

gpii.templates.tests.promiseWrapper.constructPromise = function (that) {
    that.afterDestroyPromise = when.promise(function () {});
};

gpii.templates.tests.promiseWrapper.waitAndResolve = function (that, timeout) {
    timeout = timeout ? timeout : 500;
    return function () {
        setTimeout(that.afterDestroyPromise.resolve, timeout);
    };
};

fluid.defaults("gpii.templates.tests.promiseWrapper", {
    gradeNames:  ["fluid.component"],
    members: {
        afterDestroyPromise: false
    },
    listeners: {
        "onCreate.constructPromise": {
            funcName: "gpii.templates.tests.promiseWrapper.constructPromise",
            args:     ["{that}"]
        },
        "afterDestroy.resolvePromise": {
            funcName: "gpii.templates.tests.promiseWrapper.waitAndResolve",
            args:     ["{that}"]
        }
    }
});