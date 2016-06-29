# `gpii.handlebars.helper`

This is the base grade for Fluid components that are intended to add new [Handlebars block helpers](http://handlebarsjs.com/block_helpers.html)
to an instance of [`gpii.express.hb`](handlebars.md).

## Component Invokers

### `{that}.getHelper()`

Each "helper" module is expected to implement a `getHelper` invoker with an invoker that returns a helper function. something like the following:

```
fluid.registerNamespace("your.helper");

your.helper.getHelperFn = function(that){
   return function(arg1, arg2) {
       // The two argument variations have the "options" object as the second argument.  one-argument variations have it as the first.
       var options = arg2 ? arg2 : arg1;
       return options.fn(this);
   };
};

fluid.defaults("your.helper", {
    gradeNames: ["gpii.handlebars.helper"],
    invokers: {
    "getHelper": {
        "funcName": "your.helper.getHelperFn",
        "args":     ["{that}"]
    }
   }
});
```

See [the Handlebars documentation](http:handlebarsjs.com/block_helpers.html) for an overview of the various types of 
helper functions that are possible.

# Helper functions included with this package

This package provides additional handlebars helpers that can be used in your handlebars templates.  On the server side,
these are available by default when you use the `gpii.express.hb` handlebars middleware.  On the client side, these are
prewired into `gpii.templates.renderer`, the client-side renderer.

## jsonify

Convert an object into a string representation using JSON.stringify.  To use this function in your handlebars templates, add code like:

```
{{jsonify variable}}
```

For more information, see the [jsonify helper docs](jsonifyHelper.md).

## md

Transform markdown into html.  To use this function in your handlebars templates, add code like:

```
{{md variable}}

{{md "string value"}}
```

## equals

Display content when two values match.  Values can be context variables or strings:

```
{{#equals json.baz json.qux}}true{{else}}false{{/equals}}

{{#equals json.foo json.qux}}true{{else}}false{{/equals}}

{{#equals json.foo "bar"}}true{{else}}false{{/equals}}

{{#equals "nonsense" json.qux}}true{{else}}false{{/equals}}
```

Note that, just like the `{{#if}}` block provided by handlebars, the `{{#equals}}` block supports the use of an optional
`{{else}}` block for cases in which the two values are not equal. For example:

```
{{#equals VARIABLE1 VARIABLE2 }}
  The variables are equal.
{{/equals}}

{{#equals VARIABLE1 "TEXT" }}
  The variable is equal to the text.
{{#else}}
  The variable is not equal to the text.
{{/equals}}
```

Note in the second example that `else` is supported if the condition is not matched, as with the built-in `{{#if}}` helper.


