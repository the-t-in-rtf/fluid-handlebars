/* eslint-env node */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.require("%gpii-handlebars");

fluid.require("%gpii-express");
gpii.express.loadTestingSupport();

var jqUnit = require("node-jqunit");

var request = require("request");

fluid.registerNamespace("gpii.tests.handlebars.inlineMessageBundlingMiddleware");

gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle = function (response, returnedBundle, expected) {
    jqUnit.assertEquals("The response code should be as expected.", 200, response.statusCode);
    jqUnit.assertLeftHand("The returned message bundle body should contain the expected content.", expected, returnedBundle);
};

fluid.defaults("gpii.tests.handlebars.inlineMessageBundlingMiddleware.request.noHeaders", {
    gradeNames: ["kettle.test.request.http"],
    port:       "{testEnvironment}.options.port",
    path:       "/messages"
});

fluid.defaults("gpii.tests.handlebars.inlineMessageBundlingMiddleware.request", {
    gradeNames: ["gpii.tests.handlebars.inlineMessageBundlingMiddleware.request.noHeaders"],
    acceptLanguageHeaders: "en-US",
    headers: {
        "Accept-Language": "{gpii.tests.handlebars.inlineMessageBundlingMiddleware.request}.options.acceptLanguageHeaders"
    }
});

gpii.tests.handlebars.inlineMessageBundlingMiddleware.testBundleCaching = function (testEnvironment) {
    var messagesEndpoint = "http://localhost:" + testEnvironment.options.port + "/messages";

    var firstRequestOptions = {
        url: messagesEndpoint
    };

    jqUnit.stop();
    request(firstRequestOptions, function (error, response, body) {
        jqUnit.start();

        jqUnit.assertEquals("There should not be an error.", null, error);

        jqUnit.assertNotUndefined("The body should be defined.", body);

        var etag = fluid.get(response, ["headers", "etag"]);
        if (etag) {
            var secondRequestOptions = {
                url: messagesEndpoint,
                headers: {
                    "If-None-Match": etag
                }
            };
            jqUnit.stop();
            request(secondRequestOptions, function (error, response, body) {
                jqUnit.start();
                jqUnit.assertEquals("There should not be an error.", null, error);
                jqUnit.assertEquals("There should not be a body.", "", body);
                jqUnit.assertEquals("The status code should be correct.", 304, response.statusCode);
            });
        }
        else {
            jqUnit.fail("There should have been an etag in the first response");
        }
    });
};

fluid.defaults("gpii.tests.handlebars.inlineMessageBundlingMiddleware.caseHolder", {
    gradeNames: ["gpii.test.express.caseHolder"],
    expected: {
        // equivalent to "en-US"
        noHeaders: {
            "four-oh-four": "Nothing to see here.",
            "shallow-variable": "This is %condition.",
            "message-key-language-only": "Works."
        },
        // equivalent to "en-US"
        localeFailover: {
            "four-oh-four": "Nothing to see here.",
            "shallow-variable": "This is %condition.",
            "message-key-language-only": "Works."
        },
        // equivalent to "en-US"
        languageFailover: {
            "four-oh-four": "Nothing to see here.",
            "shallow-variable": "This is %condition.",
            "message-key-language-only": "Works."
        },
        // equivalent to "en-US"
        threeCharacterLanguage: {
            "four-oh-four": "Nothing to see here.",
            "shallow-variable": "This is %condition.",
            "message-key-language-only": "Works."
        },
        enLanguage: {
            "four-oh-four": "Page not found.",
            "shallow-variable": "This is %condition.",
            "message-key-language-only": "Works."
        },
        enGbLocale: {
            "four-oh-four": "Oh dear.  Nothing here.",
            noQuotes: "Quote 'works' unquote.",
            "shallow-variable": "This is %condition.",
            "message-key-language-only": "Works."
        },
        enUsLocale: {
            "four-oh-four": "Nothing to see here.",
            "shallow-variable": "This is %condition.",
            "message-key-language-only": "Works."
        },
        nlLanguage: {
            "how-are-things": "Het gaat goed.",
            "shallow-variable": "This is %condition."
        },
        nlBeLocale: {
            "how-are-things": "Het gaat goed.",
            "shallow-variable": "This is %condition.",
            "keyboard": "klavier",
            "four-oh-four": "Hier is er geen kat."
        },
        nlNlLocale: {
            "how-are-things": "Het gaat goed.",
            "shallow-variable": "This is %condition.",
            "keyboard": "toetsenbord",
            "four-oh-four": "Hier is er geen hond."
        },
        queryLocaleRequest: {
            "four-oh-four": "Oh dear.  Nothing here.",
            noQuotes: "Quote 'works' unquote.",
            "shallow-variable": "This is %condition.",
            "message-key-language-only": "Works."
        },
        // equivalent to "en"
        weightedLocale: {
            "shallow-variable": "This is %condition.",
            "four-oh-four": "Page not found.",
            "message-key-language-only": "Works."
        },
        // equivalent to "en-US".
        wildcardLocale: {
            "shallow-variable": "This is %condition.",
            "four-oh-four": "Nothing to see here.",
            "message-key-language-only": "Works."
        }
    },
    rawModules: [
        {
            name: "Testing message bundling middleware...",
            tests: [
                {
                    name: "Message bundle caching should work as expected.",
                    type: "test",
                    sequence: [{
                        func: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.testBundleCaching",
                        args: ["{testEnvironment}"]
                    }]
                },
                {
                    name: "The default language should be used if there are no Accept-Language headers.",
                    type: "test",
                    sequence: [
                        {
                            func: "{noHeadersRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{noHeadersRequest}.events.onComplete",
                            args:     ["{noHeadersRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.noHeaders"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "We should be able to fail over from a locale with no messages to the underlying language.",
                    type: "test",
                    sequence: [
                        {
                            func: "{localeFailoverRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{localeFailoverRequest}.events.onComplete",
                            args:     ["{localeFailoverRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.localeFailover"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "We should be able to fail over from a language with no messages to the default locale.",
                    type: "test",
                    sequence: [
                        {
                            func: "{languageFailoverRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{languageFailoverRequest}.events.onComplete",
                            args:     ["{languageFailoverRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.languageFailover"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "We should be able to handle three character language codes.",
                    type: "test",
                    sequence: [
                        {
                            func: "{threeCharacterLanguageRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{threeCharacterLanguageRequest}.events.onComplete",
                            args:     ["{threeCharacterLanguageRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.threeCharacterLanguage"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "We should be able to handle a request for the language 'en'.",
                    type: "test",
                    sequence: [
                        {
                            func: "{enLanguageRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{enLanguageRequest}.events.onComplete",
                            args:     ["{enLanguageRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.enLanguage"] // response, returnedBundle, expected
                            //args:     ["{enLanguageRequest}.nativeResponse", "{arguments}.0", "{caseHolder}.options.expected.enLanguage"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "We should be able to handle a request for the locale 'en_GB'.",
                    type: "test",
                    sequence: [
                        {
                            func: "{enGbLocaleRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{enGbLocaleRequest}.events.onComplete",
                            args:     ["{enGbLocaleRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.enGbLocale"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "We should be able to handle a request for the default locale 'en_US'.",
                    type: "test",
                    sequence: [
                        {
                            func: "{enUsLocaleRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{enUsLocaleRequest}.events.onComplete",
                            args:     ["{enUsLocaleRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.enUsLocale"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "We should be able to handle a request for the language 'nl'.",
                    type: "test",
                    sequence: [
                        {
                            func: "{nlLanguageRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{nlLanguageRequest}.events.onComplete",
                            args:     ["{nlLanguageRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.nlLanguage"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "We should be able to handle a request for the locale 'nl_BE'.",
                    type: "test",
                    sequence: [
                        {
                            func: "{nlBeLocaleRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{nlBeLocaleRequest}.events.onComplete",
                            args:     ["{nlBeLocaleRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.nlBeLocale"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "We should be able to handle a request for the locale 'nl_NL'.",
                    type: "test",
                    sequence: [
                        {
                            func: "{nlNlLocaleRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{nlNlLocaleRequest}.events.onComplete",
                            args:     ["{nlNlLocaleRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.nlNlLocale"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "We should be able to specify a locale as a query parameter.",
                    type: "test",
                    sequence: [
                        {
                            func: "{queryLocaleRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{queryLocaleRequest}.events.onComplete",
                            args:     ["{queryLocaleRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.queryLocaleRequest"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "We should be able to handle a request for a weighted set of preferred languages.",
                    type: "test",
                    sequence: [
                        {
                            func: "{weightedLocaleRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{weightedLocaleRequest}.events.onComplete",
                            args:     ["{weightedLocaleRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.weightedLocale"] // response, returnedBundle, expected
                        }
                    ]
                },
                {
                    name: "A wildcard in the Accept-Language header should return the data for the default locale.",
                    type: "test",
                    sequence: [
                        {
                            func: "{wildcardLocaleRequest}.send"
                        },
                        {
                            listener: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.verifyLanguageBundle",
                            event:    "{wildcardLocaleRequest}.events.onComplete",
                            args:     ["{wildcardLocaleRequest}.nativeResponse", "@expand:JSON.parse({arguments}.0)", "{caseHolder}.options.expected.wildcardLocale"] // response, returnedBundle, expected
                        }
                    ]
                }
            ]
        }
    ],
    components: {
        noHeadersRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request.noHeaders"
        },
        localeFailoverRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                acceptLanguageHeaders: "en-ca"
            }
        },
        languageFailoverRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                acceptLanguageHeaders: "fr"
            }
        },
        threeCharacterLanguageRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                acceptLanguageHeaders: "tlh" // Klingon
            }
        },
        enLanguageRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                acceptLanguageHeaders: "en"
            }
        },
        enGbLocaleRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                acceptLanguageHeaders: "en-GB"
            }
        },
        enUsLocaleRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                acceptLanguageHeaders: "en-US"
            }
        },
        nlLanguageRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                acceptLanguageHeaders: "nl"
            }
        },
        nlBeLocaleRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                acceptLanguageHeaders: "nl-BE"
            }
        },
        nlNlLocaleRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                acceptLanguageHeaders: "nl-NL"
            }

        },
        queryLocaleRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                path: "/messages?locale=en-GB"
            }
        },
        weightedLocaleRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                acceptLanguageHeaders: "fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5"
            }

        },
        wildcardLocaleRequest: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.request",
            options: {
                acceptLanguageHeaders: "*"
            }
        }
    }
});

fluid.defaults("gpii.tests.handlebars.inlineMessageBundlingMiddleware.environment", {
    gradeNames:  ["gpii.test.express.testEnvironment"],
    port: 6494,
    events: {
        messagesLoaded: null,
        onFixturesConstructed: {
            events: {
                onExpressReady: "onExpressReady",
                messagesLoaded: "messagesLoaded"
            }
        }
    },
    components: {
        express: {
            options: {
                components: {
                    messageLoader: {
                        type: "gpii.handlebars.i18n.messageLoader",
                        options: {
                            messageDirs: {
                                primary: "%gpii-handlebars/tests/messages/primary",
                                secondary: "%gpii-handlebars/tests/messages/secondary"
                            },
                            listeners: {
                                "onMessagesLoaded.notifyParent": {
                                    func: "{testEnvironment}.events.messagesLoaded.fire"
                                }
                            }
                        }
                    },
                    inlineMessageBundlingMiddleware: {
                        type: "gpii.handlebars.inlineMessageBundlingMiddleware",
                        options: {
                            model: {
                                messageBundles: "{messageLoader}.model.messageBundles"
                            }
                        }
                    }
                }
            }
        },
        caseHolder: {
            type: "gpii.tests.handlebars.inlineMessageBundlingMiddleware.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.handlebars.inlineMessageBundlingMiddleware.environment");
