"use strict";
var sequence = require("when/sequence");

var promises = [];
promises.push(require("./js/browser/all-browser-tests"));
promises.push(require("./js/server/all-server-tests"));

sequence(promises);