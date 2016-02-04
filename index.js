// Include all server side components and register our working directory.
//
"use strict";
var fluid = require("infusion");
fluid.module.register("gpii-handlebars", __dirname, require);

// Common base components for both server and client side
require("./src/js/common/helper");
require("./src/js/common/equals");
require("./src/js/common/jsonify");
require("./src/js/common/md-common");

// Server-side components
require("./src/js/server/dispatcher");
require("./src/js/server/inline");
require("./src/js/server/md-server");
require("./src/js/server/handlebars");
require("./src/js/server/initblock");
require("./src/js/server/singleTemplateRouter");
require("./src/js/server/standaloneRenderer");


