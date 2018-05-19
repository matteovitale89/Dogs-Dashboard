const path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
const gutil = require('gulp-util');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');

const SOURCE_DIR = './src';
const DIST_DIR = './dist';
const PRODUCTION = process.env.NODE_ENV === 'production';

function handleCustomError(type) {
    return function handleError(err) {
        gutil.log(`${gutil.colors.red(type)}: ${err}`);
        gutil.beep();
        this.emit('end');
    };
}

gulp.task('css', function() {
    var plugins = [
        autoprefixer({browsers: ['last 2 version', 'Safari 8']}),
        cssnano(),
    ];
    return gulp
        .src(`${SOURCE_DIR}/scss/main.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(plugins))
        .pipe(gulp.dest(`${DIST_DIR}/css/`))
        .pipe(browserSync.stream());
});

gulp.task('font', function() {
    gulp
        .src(`${SOURCE_DIR}/webfonts/**`)
        .pipe(gulp.dest(`${DIST_DIR}/webfonts/`));
});

gulp.task('assets', function() {
    gulp.src(`${SOURCE_DIR}/assets/**`).pipe(gulp.dest(`${DIST_DIR}/assets/`));
});

gulp.task('view', function() {
    gulp
    .src(`${SOURCE_DIR}/index.html`)
    .pipe(gulp.dest(`${DIST_DIR}/`))
    .on('end', () => browserSync.reload());;
});

function bundle(sourcePath, filename) {
    return function() {
        let b = browserify({
            entries: [`${SOURCE_DIR}${sourcePath}`],
            debug: !PRODUCTION,
        }).transform('babelify', {
            presets: ['es2015', 'react'],
            plugins: [
                'transform-object-rest-spread',
                'transform-class-properties',
            ],
        });

        return b
            .bundle()
            .on('error', handleCustomError('Browserify'))
            .pipe(source(filename))
            .pipe(PRODUCTION ? buffer() : gutil.noop())
            .pipe(PRODUCTION ? uglify() : gutil.noop())
            .on('error', handleCustomError('Uglify'))
            .pipe(gulp.dest(`${DIST_DIR}/js/`))
            .on('end', () => browserSync.reload());
    };
}

gulp.task('browser-sync', ['build'], function() {
    browserSync.init({
        server: {
            baseDir: DIST_DIR,
        },
    });
});

gulp.task('watcher', ['build'], function() {
    gulp.watch(`${SOURCE_DIR}/scss/**/*.scss`, ['css']);
    gulp.watch(`${SOURCE_DIR}/js/**/*.js`, ['react']);
    gulp.watch(`${SOURCE_DIR}/index.html`, ['view']);
});

gulp.task('react', bundle('/js/main.js', 'react.js'));

gulp.task('build', ['view', 'css', 'react', 'font', 'assets']);
gulp.task('dev', ['build', 'watcher', 'browser-sync']);
