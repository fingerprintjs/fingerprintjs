var gulp = require('gulp'),
  eslint = require('gulp-eslint');

gulp.task("lint", function() {
  return gulp
    .src("fingerprint2.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task("default", ["lint"], function() {

});
