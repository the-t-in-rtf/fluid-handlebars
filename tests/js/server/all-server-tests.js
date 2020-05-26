/* eslint-env node */
"use strict";

// If this runs after the dispatcher tests the tests will fail because we are somehow getting the "secondary" templates.
require("./standaloneRenderer-tests");

// IoC tests must run first until this issue is resolved: https://issues.fluidproject.org/browse/FLUID-6397
require("./dispatcher-tests.js");
require("./errorRenderingMiddleware-tests");
require("./inlineMessageBundlingMiddleware-tests");
require("./live-reload-tests");
require("./resolver-tests");
require("./singleTemplateMiddleware-tests");
require("./watcher-tests");

// Non-IoC tests
require("./first-matching-path-tests");
require("./i18n-unit-tests");
require("./inline-tests");
