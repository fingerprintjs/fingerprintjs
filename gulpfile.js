var gulp = require("gulp"),
    eslint = require("gulp-eslint"),
    rename = require("gulp-rename"),
    closureCompiler = require('google-closure-compiler').gulp();

gulp.task("lint", function() {
  return gulp
    .src("fingerprint2.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task("minify", function() {
  return gulp
      .src("fingerprint2.js")
      .pipe(closureCompiler({
        language_in : "ECMASCRIPT3",
        language_out : "ECMASCRIPT3",
        compilation_level: 'ADVANCED_OPTIMIZATIONS',
        warning_level: 'VERBOSE',
        jscomp_warning : "typeInvalidation",
        jscomp_warning : "missingProperties",
        jscomp_warning : "accessControls",
        jscomp_warning : "checkTypes",
        jscomp_error : "checkDebuggerStatement",
        jscomp_error : "constantProperty",
        jscomp_error : "const",
        jscomp_error : "deprecated",
        jscomp_error : "inferredConstCheck",
        jscomp_error : "missingReturn",
        jscomp_error : "unknownDefines",
        jscomp_error : "visibility",
        js_output_file: 'fingerprint2.min.js',
        use_types_for_optimization : true,
        define: [
          "FP2_DEBUG_MODE=false",
          "FP2_EXPORT_MODE=true",
          "FP2_VERBOSE_MODE=false",
        ]
      }))
      .pipe(gulp.dest("dist/"));
});


gulp.task("default", ["lint", "minify"], function() {});
