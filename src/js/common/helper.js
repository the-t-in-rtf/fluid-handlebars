// Base gradeName for handlebars "helper" modules, which can be used on both the client and server side handlebars stacks.
var fluid = fluid || require('infusion');
var gpii  = fluid.registerNamespace("gpii");
fluid.registerNamespace("gpii.templates.hb.helper");

// Return a function that processes handlebars content.
//
// See http://handlebarsjs.com/block_helpers.html for an overview of the various types of helpers that are possible.
//
// This is a "noop" function that also serves as an example of what arguments are expected.
//
// Each "helper" module is expected to replace this function.
gpii.templates.hb.helper.getNoopHelper = function(that){
    return function(arg1, arg2) {
        // The two argument variations have the "options" object as the second argument.  one-argument variations have it as the first.
        var options = arg2 ? arg2 : arg1;
        return options.fn(this);
    };
};

fluid.defaults("gpii.templates.hb.helper", {
    gradeNames: ["fluid.eventedComponent", "fluid.modelRelayComponent", "autoInit"],
    invokers: {
        "getHelper": {
            "funcName": "gpii.templates.hb.helper.getNoopHelper",
            "args":     ["{that}"]
        }
    }
});