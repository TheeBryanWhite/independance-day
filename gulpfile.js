var pkg = require('./package.json');
var gulp = require('gulp');

const BrowserSync = require('./gulp-tasks/browser-sync');
const Sass = require('./gulp-tasks/sass');
const Scripts = require('./gulp-tasks/scripts');

gulp.task('browser-sync-init', BrowserSync.initialize);
gulp.task('js-watch', ['js'], BrowserSync.reload);
gulp.task('reload-watch', ['copy'], BrowserSync.reload);

gulp.task('sass', Sass.build);

gulp.task('lint', Scripts.lint);
gulp.task('js', ['lint'], Scripts.build);

gulp.task('copy', function(){
    gulp.src(`${pkg.config.src}/index.html`)
        .pipe(gulp.dest(pkg.config.dist));
})

gulp.task('default', ['sass', 'js', 'browser-sync-init'], function(){
    gulp.watch(`${pkg.config.src}/**/*.scss`, ['sass']);
    gulp.watch(`${pkg.config.src}/**/*.js`, ['js-watch']);
});
