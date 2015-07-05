var gulp = require("gulp"),
    eslint = require("gulp-eslint"),
    uglify = require("gulp-uglify"),
    phantom = require('gulp-jasmine-phantom');

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
      .pipe(uglify({
          compress: {
            global_defs: {
              NODEBUG: true
            }
          }
      }))
      .pipe(gulp.dest("dist"));
});


gulp.task("default", ["lint", "minify"], function() {});
