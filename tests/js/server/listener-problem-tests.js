// TODO: This has been checked in for discussion purposes, but should clearly be removed once the root cause and solutions
// are agreed.
/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.loadTestingSupport();
require("node-jqunit");
fluid.registerNamespace("gpii.tests.listener.resourceLoader");

gpii.tests.listener.resourceLoader.generateResolvedPromise = function () {
    return function () {
        var simplePromise = fluid.promise();
        simplePromise.resolve("Everything is fine.");
        return simplePromise;
    };
};

fluid.defaults("gpii.tests.listener.resourceLoader", {
    gradeNames: ["fluid.resourceLoader", "fluid.modelComponent"],
    resources: {
        promiseResource: {
            promiseFunc: "@expand:gpii.tests.listener.resourceLoader.generateResolvedPromise()"
        }
    },
    model: {
        promiseResource: "{that}.resources.promiseResource.parsed"
    }
});

fluid.defaults("gpii.tests.listener.caseHolder", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [{
        name: "Attempting to reproduce destroy issues in isolation.",
        tests: [
            {
                name: "Create and interrogate a component once.",
                sequence: [
                    {
                        func: "{testEnvironment}.events.createComponent.fire"
                    },
                    {
                        event: "{testEnvironment}.events.componentReady",
                        listener: "jqUnit.assert",
                        args: ["The component was created and is reported as ready."]
                    }
                ]
            },
            {
                name: "Create and interrogate a component again.",
                sequence: [
                    {
                        func: "{testEnvironment}.events.createComponent.fire"
                    },
                    {
                        event: "{testEnvironment}.events.componentReady",
                        listener: "jqUnit.assert",
                        args: ["The component was recreated and is reported as ready."]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.listener.testEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],
    events: {
        createComponent: null,
        componentReady:  null
    },
    components: {
        caseHolder: {
            type: "gpii.tests.listener.caseHolder"
        },
        resourceLoader: {
            createOnEvent: "createComponent",
            type: "gpii.tests.listener.resourceLoader",
            options: {
                listeners: {
                    "onResourcesLoaded.notifyParent": {
                        func: "{testEnvironment}.events.componentReady.fire"
                    }
                }
            }
        }
    }
});

fluid.test.runTests("gpii.tests.listener.testEnvironment");
