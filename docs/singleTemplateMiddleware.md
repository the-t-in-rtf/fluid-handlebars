# `fluid.express.singleTemplateMiddleware`

A `fluid.express.router` component that uses the standard renderer to display the template found at
`that.options.templateKey`.

The handlebars context will be generated from the component itself and the rules found in
`options.rules.contextToExpose`. These are used in the same way as in the `dispatcher`, i.e. the component's `model`
and the incoming `request` object are the only things available as a starting point for your rules.  By default, the
request (path) and query parameters are exposed.

This is particularly relevant when working with `initBlock` instances, where you might want to incorporate
`req.params.code` or another variable into your model.  Assuming you are using the defaults here, any components
created using the `initBlock` helper will have `options.req` set.

This component will only work if you have set up the `fluid.express.hb` middleware in your `fluid.express` instance.
If you want to expose request or model variables to handlebars, you will also need to have rules like the following
in your `fluid.express.hb` component's definition:

```snippet
handlebars: {
 type: "fluid.express.hb",
 options: {
     components: {
         initBlock: {
             options: {
                 contextToOptionsRules: {
                     req: "req"
                 }
             }
         }
     }
 }
},
```
