// Test all server side modules (including basic template rendering)...
"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
var path  = require("path");
fluid.registerNamespace("gpii.express");

//var jqUnit  = fluid.require("jqUnit");
var Browser = require("zombie");

require("gpii-express");

require("../../");

// Test content (HTML, JS, templates)
var testDir    = path.resolve(__dirname, "..");
var contentDir = testDir + "/html";
var viewDir    = testDir + "views";

// Dependencies
var bcDir      = path.resolve(__dirname, "../../bower_components");
var modulesDir = path.resolve(__dirname, "../../node_modules");

// Main source to be tested
var srcDir     = path.resolve(__dirname, "../../src");

var testServer = gpii.express({
    config:  {
        "express": {
            "port" :   6994,
            "baseUrl": "http://localhost:6994/",
            "views":   viewDir
        }
    },
    components: {
        inline: {
            type: "gpii.express.hb.inline",
            "options": {
                "path": "/hbs"
            }
        },
        bc: {
            type: "gpii.express.router.static",
            "options": {
                path:    "/bc",
                content: bcDir
            }
        },
        js: {
            type: "gpii.express.router.static",
            "options": {
                path:    "/src",
                content: srcDir
            }
        },
        tests: {
            type: "gpii.express.router.static",
            "options": {
                path:    "/tests",
                content: testDir
            }
        },
        modules: {
            type: "gpii.express.router.static",
            "options": {
                path:    "/modules",
                content: modulesDir
            }
        },
        content: {
            type: "gpii.express.router.static",
            "options": {
                path:    "/content",
                content: contentDir
            }
        },
        handlebars: {
            type: "gpii.express.hb"
        }
    }
});

testServer.runTests = function () {
    var browser = Browser.create();

    jqUnit.module("Integration tests for combined client and server-side template handling...");

    /*
     // All tests should look for rendered content as well as variables, jsonify content, and markdown content
     gpii.hb.clientTests.commonTests = function (that, element) {
     jqUnit.assertNotNull("The results should not be null.", element.html());

     var mdRegexp = /<p><em>this works<\/em><\/p>/i;
     jqUnit.assertNotNull("The results should contain transformed markdown.", element.html().match(mdRegexp));

     var variableRegexp = new RegExp(that.model.myvar);
     jqUnit.assertNotNull("The results should contain variable data.", element.html().match(variableRegexp));

     var jsonifyRegexp = new RegExp(JSON.stringify(that.model.json));
     jqUnit.assertNotNull("The results should contain jsonify data.", element.html().match(jsonifyRegexp));

     // TODO:  Uncomment this out once we confirm that zombie works without the hard-coded templates
     //function isTruthful(value) {
     //    return String(value).toLowerCase() === "true";
     //}
     //
     //// Test the `equals` block helper.
     //
     //// All of the elements tagged with the "equal" class should produce the value "true"
     //var equalCandidates = element.find("equal");
     //for (var a = 0; a < equalCandidates.length; a++) {
     //    var equalCandidate = equalCandidates[a];
     //    jqUnit.assertTrue("Equal items should execute the main block.", isTruthful(equalCandidate.text()));
     //}
     //
     //// All of the elements tagged with the "unequal" class should produce the value "false"
     //var unequalCandidates = element.find("unequal");
     //for (var b = 0; b < unequalCandidates.length; b++) {
     //    var unequalCandidate = unequalCandidates[b];
     //    jqUnit.assertFalse("Unequal items should execute the alternate block.", isTruthful(unequalCandidate.text()));
     //}
     };

     gpii.hb.clientTests.runTests = function (that) {
     that.templates.loadPartials();

     jqUnit.asyncTest("Testing 'after' function...", function () {
     var element = that.locate("viewport-after");
     that.templates.after(element, that.model.templateName, that.model);

     jqUnit.start();
     jqUnit.assertTrue("The original element should contain the original text", element.html().indexOf("original content") !== -1);

     var elementAfter = element.next();
     jqUnit.assertTrue("The inserted element should contain new content", elementAfter.html().indexOf("from the template") !== -1);

     that.commonTests(elementAfter);
     });

     jqUnit.asyncTest("Testing 'append' function...", function () {
     var element = that.locate("viewport-append");
     that.templates.append(element, that.model.templateName, that.model);

     jqUnit.start();
     jqUnit.assertTrue("The updated element should contain the original text", element.html().indexOf("original content") !== -1);

     var appendRegexp = /^original content/;
     jqUnit.assertNotNull("The original text should be at the beginning of the results", element.html().match(appendRegexp));

     that.commonTests(element);
     });

     jqUnit.asyncTest("Testing 'before' function...", function () {
     var element = that.locate("viewport-before");
     that.templates.before(element, that.model.templateName, that.model);

     jqUnit.start();
     jqUnit.assertTrue("The original element should contain the original text", element.html().indexOf("original content") !== -1);

     var elementBefore = element.prev();
     jqUnit.assertTrue("The inserted element should contain new content", elementBefore.html().indexOf("from the template") !== -1);

     that.commonTests(elementBefore);
     });

     jqUnit.asyncTest("Testing 'html' function...", function () {
     var element = that.locate("viewport-html");
     that.templates.html(element, that.model.templateName, that.model);

     jqUnit.start();
     jqUnit.assertTrue("The updated element should not contain the original text", element.html().indexOf("original content") === -1);
     jqUnit.assertTrue("The updated element should contain new content", element.html().indexOf("from the template") !== -1);

     that.commonTests(element);
     });


     jqUnit.asyncTest("Testing 'prepend' function...", function () {
     var element = that.locate("viewport-prepend");
     that.templates.prepend(element, that.model.templateName, that.model);

     jqUnit.start();
     jqUnit.assertTrue("The updated element should contain the original text", element.html().indexOf("original content") !== -1);

     var prependRegexp = /original content$/;
     jqUnit.assertNotNull("The original text should be at the end of the results", element.html().match(prependRegexp));

     that.commonTests(element);
     });

     jqUnit.asyncTest("Testing 'replaceWith' function...", function () {
     var replaceWithElement = that.locate("viewport-replaceWith");
     that.templates.replaceWith(replaceWithElement, that.model.replaceWithTemplateName, that.model);

     var replacedElement    = that.locate("viewport-replaceWith");
     jqUnit.start();
     jqUnit.assertTrue("The updated element should not contain the original text", replacedElement.html().indexOf("original content") === -1);

     that.commonTests(replacedElement);
     });
     };

     */
    jqUnit.asyncTest("Use zombie.js to run the client-side tests...", function () {
        browser.on("error", function (error) {
            jqUnit.start();
            jqUnit.fail("There should be no errors:" + error);
        });
        browser.visit(testServer.options.config.express.baseUrl + "content/client-tests.html").then(function () {
            jqUnit.start();

            // TODO:  Move all the individual tests to this block
        });
    });
};

//testServer.runTests();


