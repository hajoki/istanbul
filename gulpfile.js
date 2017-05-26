'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint');

gulp.task('css', function () {
    var sass = require('gulp-sass');
    var postcss = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');

    return gulp.src('./asset/sass/*.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['node_modules/susy/sass']
        }).on('error', sass.logError))
        .pipe(postcss([
            autoprefixer({browsers: ['> 5%', '> 5% in US', 'last 2 versions']})
        ]))
        .pipe(gulp.dest('./asset/css'));
});

gulp.task('css:watch', function () {
    gulp.watch('./asset/sass/*.scss', ['css']);
});

// configure the jshint task
gulp.task('jshint', function() {
  return gulp.src('./asset/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// configure which files to watch and what tasks to use on file changes
gulp.task('jshint:watch', function() {
  gulp.watch('./asset/js/*.js', ['jshint']);
});