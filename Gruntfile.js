/* eslint-env node */
"use strict";
module.exports = function (grunt) {
    grunt.initConfig({
        lintAll: {
            sources: {
                md: [ "./*.md","./**/*.md", "!./node_modules/**" ],
                js: ["./src/**/*.js", "./tests/**/*.js", "./*.js"],
                json: ["./src/**/*.json", "./tests/**/*.json", "./*.json"],
                json5: ["./tests/**/*.json5"],
                other: ["./.*"]
            }
        }
    });

    grunt.loadNpmTasks("gpii-grunt-lint-all");
    grunt.registerTask("lint", "Perform all standard lint checks.", ["lint-all"]);
};
