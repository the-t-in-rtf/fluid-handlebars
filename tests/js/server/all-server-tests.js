/* eslint-env node */
"use strict";

// If this runs after the dispatcher tests the tests will fail because we are somehow getting the "secondary" templates.
// TODO: Convert all node tests to use sequences, case holders, and test environments as a first step in addressing this.
require("./standaloneRenderer-tests");

require("./dispatcher-tests.js");
require("./errorRenderingMiddleware-tests");
require("./first-matching-path-tests");
require("./i18n-unit-tests");
require("./inline-tests");
require("./inlineMessageBundlingMiddleware-tests");
require("./live-reload-tests");
require("./resolver-tests");
require("./singleTemplateMiddleware-tests");
require("./watcher-tests");
