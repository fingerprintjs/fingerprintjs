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
        js_output_file: 'fingerprint2.min.js',
        define: [
          "DEBUG_MODE=false",
        ],
      }))
      .pipe(gulp.dest("dist/"));
});


gulp.task("default", ["lint", "minify"], function() {});
