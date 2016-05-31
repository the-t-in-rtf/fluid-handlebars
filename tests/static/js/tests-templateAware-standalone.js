/* globals fluid */
fluid.defaults("gpii.tests.handlebars.templateAware.standalone", {
    gradeNames: ["gpii.handlebars.templateAware.standalone"],
    selectors: {
        viewport: ""
    },
    templates: {
        layouts: {
            main: "{{body}}"
        },
        pages: {
            main: "This is our {{.}} template content."
        }
    },
    invokers: {
        renderInitialMarkup: {
            func: "{that}.renderMarkup",
            args: ["viewport", "main", "rendered", "html"] // selector, template, data, manipulator
        }
    }
});