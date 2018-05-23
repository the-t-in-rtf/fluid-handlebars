/* eslint-env node */
"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            js: {
                src: ["./src/**/*.js", "./tests/**/*.js", "./*.js"]
            },
            md: {
                options: {
                    configFile: ".eslintrc-md.json"
                },
                src: [ "./*.md","./**/*.md", "!./node_modules/**" ]
            }
        },
        jsonlint: {
            src: ["src/**/*.json", "tests/**/*.json", "./*.json"]
        },
        mdjsonlint: {
            src: ["./*.md", "./docs/**/*.md"]
        },
        markdownlint: {
            full: {
                options: {
                    config: {
                        // See https://github.com/DavidAnson/markdownlint#rules--aliases for rule names and meanings.
                        "no-duplicate-header": false, // We use duplicate nested headers, as in section 1 and 2 both have the same sub-section name.
                        "no-trailing-punctuation": false,  // This catches headings that are questions, which seems wrong.
                        "header-style": { style: "atx" }, // Although we use a mix, in discussion with various team members, we agreed to try this for now.
                        "no-inline-html": false, // Obviously we need HTML
                        "line-length": {
                            line_length: 120,
                            tables:      false,
                            code_blocks: false
                        },
                        "ol-prefix": {style: "ordered"} // 1. 2. 3. etc
                    }
                },
                src: ["./*.md", "./docs/**/*.md"]
            }
        },
        mdlint: ["./*.md", "./docs/**/*.md"]
    });

    grunt.loadNpmTasks("fluid-grunt-eslint");
    grunt.loadNpmTasks("grunt-jsonlint");
    grunt.loadNpmTasks("grunt-markdownlint");
    grunt.loadNpmTasks("gpii-grunt-mdjson-lint");

    grunt.registerTask("lint", "Apply eslint, jsonlint, json5lint, and various markdown linting checks", ["eslint:js", "jsonlint", "markdownlint", "eslint:md", "mdjsonlint"]);
};
