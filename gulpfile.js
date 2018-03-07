'use strict';

var path = require('path');
var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var sass = require('gulp-ruby-sass');
var cache = require('gulp-cache');
var imagemin = require('gulp-imagemin');
var size = require('gulp-size');
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var php  = require('gulp-connect-php');
var browserSync = require('browser-sync');

var config = {
   input: './app/',
   output: './dist/',
   jsInputs: [
    './app/js/jquery-1.12.0.min.js',
    './app/js/main.js'
   ],
   bootstrapImportPath: './node_modules/bootstrap-sass/assets/stylesheets/'
};

var reload  = browserSync.reload;

gulp.task('php', function() {
    php.server({ base: path.resolve(), port: 8010, keepalive: true});
});

gulp.task('browser-sync',['php'], function() {
    browserSync({
        proxy: '127.0.0.1:8010',
        port: 8080,
        open: true,
        notify: false
    });
});

gulp.task('images', function () {
   return gulp.src(config.input + '/img/**/*')
        .pipe(cache(imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest(config.output + 'img'))
        .pipe(size({title: 'img'}))
});

gulp.task('styles', function() {
    return sass(config.input + 'sass/main.scss', {
            sourcemap: true,
            style: 'compressed',
            loadPath: [
                config.bootstrapImportPath
            ]
        })
		.on('error', sass.logError)
		.pipe(sourcemaps.write())
		.pipe(sourcemaps.write('maps', {
			includeContent: false,
			sourceRoot: 'source'
		}))
		.pipe(gulp.dest(config.output + 'css'))
});

gulp.task('scripts', function () {
    return gulp.src(
        config.jsInputs
    )
               .pipe(concat('main.min.js'))
               .pipe(uglify({preserveComments: 'some'}))
               .pipe(size({title: 'scripts'}))
               .pipe(gulp.dest(config.output + 'js'));
});

gulp.task('clean', function () {
    return del(['dist'], {dot: true})
});

gulp.task('serve', ['scripts', 'styles', 'images', 'browser-sync'], function () {
    gulp.watch([config.input + 'sass/**/*'], ['styles', reload]);
    gulp.watch([config.input + 'js/**/*.js'], ['scripts', reload]);
    gulp.watch('img/**/*', { cwd: './app' }, ['images', reload]);
    gulp.watch('**/*.php').on('change', function () {
        browserSync.reload();
    });
});

gulp.task('build:cms', function () {
    return gulp.src(['dist/**/*'])
        .pipe(gulp.dest('../public/html'));
});

gulp.task('default', ['clean'], function (cb) {
    runSequence(
        'styles',
        ['scripts', 'images'],
        cb
    )
});
