'use strict';

var path = require('path');
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
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
        'app/*',
        '!app/*.html',
        'node_modules/apache-server-configs/dist/.htaccess'
    ], {
        dot: true
    }).pipe(gulp.dest('dist'))
               .pipe($.size({title: 'copy'}))
});
gulp.task('styles', function () {
    var AUTOPREFIXER_BROWSERS = [
        'ie >= 10',
        'ie_mob >= 10',
        'ff >= 30',
        'chrome >= 34',
        'safari >= 7',
        'opera >= 23',
        'ios >= 7',
        'android >= 4.4',
        'bb >= 10'
    ];

    return gulp.src([
        'app/sass/main.scss',
        'app/css/**/*.css'
    ])
               .pipe($.newer('.tmp/styles'))
               .pipe($.sourcemaps.init())
               .pipe($.sass({
                   precision: 10
               }).on('error', $.sass.logError))
               .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
               .pipe(gulp.dest('.tmp/styles'))
               // Concatenate and minify styles
               .pipe($.if('*.css', $.cssnano()))
               .pipe($.size({title: 'styles'}))
               .pipe($.sourcemaps.write('./'))
               .pipe(gulp.dest('dist/css'))
               .pipe(gulp.dest('.tmp/styles'));
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
    return del(['.tmp', 'dist/*', '!dist/.git'], {dot: true})
});


gulp.task('serve', ['scripts', 'styles'], function () {
    gulp.watch(['app/sass/**/*'], ['styles']);
    gulp.watch(['app/scripts/**/*.js'], ['scripts']);
    gulp.watch(['app/img/**/*'], ['images']);
});


gulp.task('default', ['clean'], function (cb) {
    runSequence(
        'styles',
        ['scripts', 'images', 'copy'],
        cb
    )
});