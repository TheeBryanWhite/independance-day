var pkg = require('../package.json');
var fs = require('fs');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var browserify = require('browserify');
var exorcist = require('exorcist');
var mold = require('mold-source-map');

const lint = function(){
    return gulp.src(`${pkg.config.src}/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

const build = function(){
    return browserify(`${pkg.config.src}/js/main.js`, {
            debug: true
        })
        .transform('babelify', {
            presets: ['es2015', 'react']
        })
        .bundle()
        .pipe(mold.transformSourcesRelativeTo(`${pkg.config.scripts}/site`))
        .pipe(exorcist(`${pkg.config.dist}/main.js.map`))
        .pipe(fs.createWriteStream(`${pkg.config.dist}/main.js`));
}

module.exports = { lint, build }
