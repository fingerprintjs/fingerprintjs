const gulp = require('gulp')
const standard = require('gulp-standard')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const license = require('gulp-header-license')
const fs = require('fs')
const year = (new Date()).getFullYear()

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
      }).on('error', function (e) {
        console.log(e)
      }))
      .pipe(license(fs.readFileSync('license.txt', 'utf8'), {YEAR: year}, 0.9))
      .pipe(gulp.dest('dist/'))
})

gulp.task('default', ['lint', 'minify'], function () {})
