var pkg = require('../package.json');
var fs = require('fs');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var browserify = require('browserify');
var exorcist = require('exorcist');
var mold = require('mold-source-map');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var colors = require('colors/safe');

const handleError = function(err){
    console.error('---------------------------');
    console.error(colors.red.bold('ERROR Building JS Bundle!'));
    console.error(colors.red(err.message));
    console.error('---------------------------');

    this.emit('end');
}

var bundler = browserify('src/js/main.js', {
    debug: true
});

bundler.transform(babelify.configure({
    sourceMapsAbsolute: true,
    presets: ['es2015', 'react']
}));

function build(){
    return bundler.bundle()
        .on('error', handleError)
        .pipe(exorcist('dist/main.js.map'))
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('dist'))
}

const lint = function(){
    return gulp.src('src/js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}
module.exports = { lint, build }