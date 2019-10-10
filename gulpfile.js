const gulp = require('gulp')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const license = require('gulp-header-license')
const fs = require('fs')
const year = (new Date()).getFullYear()

gulp.task('minify', function () {
  return gulp
      .src('fingerprint2.js')
      .pipe(rename({suffix: '.min'}))
      .pipe(uglify({
        ie8: true,
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

gulp.task('default', gulp.series('minify', function (done) { done() }))
