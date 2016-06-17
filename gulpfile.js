var gulp = require('gulp');
// utils
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var watch = require('gulp-watch');
var del = require('del');

// Sass/CSS
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');

// CoffeeScript/JavaScript
var coffee = require('gulp-coffee');
var uglify = require('gulp-uglify');

gulp.task('sass', function() {
  return gulp.src(['src/**/*.scss', 'src/**/*.sass'])
    .pipe(sass().on('error', gutil.log))
    .pipe(prefix("> 1%"))
    // This will output the non-minified version
    .pipe(gulp.dest('dst/'))
    // This will minify and rename to foo.min.css
    .pipe(cssmin({ keepSpecialComments: 0 }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('dst/'));
});

gulp.task('coffee', function() {
  gulp.src(['src/**/*.coffee'])
    .pipe(coffee({ bare: true }).on('error', gutil.log))
    // This will output the non-minified version
    .pipe(gulp.dest('dst/'))
    // This will minify and rename to foo.min.js
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('dst/'));
});

gulp.task('build', ['sass', 'coffee']);
gulp.task('clear', function(){
  return del([
    'dst/**/*'
  ]);
});

gulp.task('default', ['build']);
