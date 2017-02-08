/* eslint-env node */
"use strict";

// If I run these in the other order, I get "test outside of test context" messages.
// TODO: Discuss with Antranig
require("./js/browser/all-browser-tests");
require("./js/server/all-server-tests");
