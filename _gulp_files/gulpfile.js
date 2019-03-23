const gulp = require('gulp'),
    path = require('path'),
    del = require('del'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    minifyCss = require('gulp-clean-css'),
    modifyCssUrls = require('gulp-modify-css-urls'),
    svgSprite = require("gulp-svg-sprites"),
    imagemin = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify-es').default,
    flatten = require('gulp-flatten'),
    rename = require('gulp-rename'),
    run = require('gulp-run-command').default,
    fs = require('fs'),
    layout = require('layout'),
    request = require('request'),
    replace = require('gulp-replace'),
    download = require('gulp-download'),
    cheerio = require('cheerio'),
    through2 = require('through2'),
    File = require('vinyl'),
    watch = require('gulp-watch')
//cpqTemplate = require('../Global/modules/cpqHTMLTemplate');

// ================== Paths ==================
const PATH = {
    input: '../',
    output: 'build/',
};

const basePaths = {
    stylePath: `styles`,
    scriptPath: `scripts`,
    spritePath: `img/sprites`
};

const activeMasterStylePath = PATH.input + basePaths.stylePath + "/index.less";


// ================== Delete ==================
gulp.task('delete-css', () => del(PATH.output + basePaths.stylePath));

gulp.task('delete-scripts', () => del(PATH.output + basePaths.scriptPath));


// ================== CSS ==================
gulp.task('minify-styles', () => {
    gulp.src(activeMasterStylePath)
        .pipe(
            less({
                paths: [`${activeMasterStylePath}/**/*.css`],
                javascriptEnabled: true
            }).on('error', (erro) => {
                console.log('LESS, erro compilação: ' + erro.filename);
                console.log(erro.message);
            })
        )
        .pipe(
            rename(function (inputPath) {
                inputPath.basename;
            })
        )
        .pipe(
            minifyCss({
                normalizeUrls: false,
                rebase: false
            })
        )
        .pipe(flatten())
        .pipe(gulp.dest(PATH.output + "/styles"))
});

// ================== HTML ==================

gulp.task('move-html', () => {
    return gulp.src(PATH.input + "html/**.html")
        .pipe(gulp.dest(PATH.output))
});

// ================== Scripts ==================

gulp.task('minify-scripts', () => {
    return gulp.src(PATH.input + basePaths.scriptPath + "/**.js")
        // .pipe(stripDebug())
        // .pipe(uglify())
        // .pipe(flatten())
        .pipe(gulp.dest(PATH.output + "/scripts"))
});

// ================== Require ==================
gulp.task('require-compile', ['require-compile-cart'], run(`node r.js -o optimize=none include=requireLib paths.requireLib=require name=scriptLoader out=build/scripts/scriptLoader.js baseUrl=build/scripts`));
gulp.task('require-compile-cart', ['minify-scripts'], run(`node r.js -o optimize=none include=requireLib paths.requireLib=require name=cartScriptLoader out=build/scripts/cartScriptLoader.js baseUrl=build/scripts`));


// ================== Tasks ==================

// scritps
gulp.task('compile-scripts', ['delete-scripts'], () => gulp.start('require-compile'));

// scripts over
gulp.task('compile-scripts-over', ['delete-scripts'], () => gulp.start('compile-scripts-over'));

// css
gulp.task('compile-css', ['delete-css'], () => gulp.start('minify-styles'));

gulp.task('compile-css-over', ['delete-css'], () => gulp.start('minify-styles-overide'));


// sprites

//gulp.task('sprite-pos-png', ['delete-sprites', 'setActive-Pos'], () => gulp.start('sprites-png'));

gulp.task('build-project', ['compile-css', 'compile-scripts'], function () {});

gulp.task('watch-project', [], function () {
    watch(PATH.input + "/scripts/**.js", [], function (event) {
        console.log('File' + event.path + ' was ' + event.type);
        return gulp.start("compile-scripts");
    });
    watch(PATH.input + "/styles/**.less", [], function (event) {
        console.log('File' + event.path + ' was ' + event.type);
        return gulp.start("compile-css");
    });
    watch(PATH.input + "/html/**.html", [], function (event) {
        console.log('File' + event.path + ' was ' + event.type);
        return gulp.start("move-html");
    });
});