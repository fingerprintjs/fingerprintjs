const gulp = require('gulp')
const standard = require('gulp-standard')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')

gulp.task('lint', function () {
  return gulp
    .src('fingerprint2.js')
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      quiet: true
    }))
})

gulp.task('minify', function () {
  return gulp
      .src('fingerprint2.js')
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify({
        compress: {
          global_defs: {}
        },
        output: {
          ascii_only: true
        }
      }))
      .pipe(gulp.dest('dist/'))
})

gulp.task('default', ['lint', 'minify'], function () {})
