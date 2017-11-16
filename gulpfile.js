'use strict';

var path = require('path');
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var sass = require('gulp-ruby-sass');
var cleanCSS = require('gulp-clean-css');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();


gulp.task('images', function () {
   return gulp.src('app/img/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img'))
        .pipe($.size({title: 'img'}))
});

gulp.task('copy', function () {
    return gulp.src([
        'app/**/*',
        '!app/css/',
        '!app/css/**/*',
        '!app/js/',
        '!app/js/**/*',
        '!app/img/',
        '!app/img/**/*',
        '!app/sass/',
        '!app/sass/**/*'

    ]).pipe(gulp.dest('dist'));
});


gulp.task('styles', function () {
    var sassStream,
        cssStream;

    cssStream = [
        'app/css/normalize.css'
    ];

    sassStream = sass("app/sass/main.scss", {
        style: 'compressed',
        loadPath: './node_modules/bootstrap-sass/assets/stylesheets/'
    });

    return merge(sassStream, gulp.src(cssStream))
        .pipe($.concat('main.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'));
});
gulp.task('scripts', function () {
    return gulp.src([
        './app/js/jquery-1.12.0.min.js',
        './app/js/main.js'
    ])
               .pipe($.concat('main.min.js'))
               .pipe($.uglify({preserveComments: 'some'}))
               .pipe($.size({title: 'scripts'}))
               .pipe(gulp.dest('dist/js'))
               .pipe(gulp.dest('.tmp/scripts'))
});


gulp.task('clean', function () {
    return del(['.tmp', 'dist/*'], {dot: true})
});


gulp.task('serve', ['scripts', 'styles'], function () {
    gulp.watch(['app/**/*',
        '!app/css/',
        '!app/css/**/*',
        '!app/js/',
        '!app/js/**/*',
        '!app/img/',
        '!app/img/**/*',
        '!app/sass/',
        '!app/sass/**/*'], ['copy']);
    gulp.watch(['app/sass/**/*'], ['styles']);
    gulp.watch(['app/js/**/*.js'], ['scripts']);
    gulp.watch(['app/img/**/*'], ['images']);
});

gulp.task('build:cms', function () {
    return gulp.src(['dist/**/*', '!dist/partials','!dist/partials/*', '!dist/*.php'])
        .pipe(gulp.dest('../public/html'));
});

gulp.task('default', ['clean'], function (cb) {
    runSequence(
        'styles',
        ['scripts', 'images', 'copy'],
        cb
    )
});
