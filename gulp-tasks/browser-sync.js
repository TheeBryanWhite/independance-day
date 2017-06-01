var pkg = require('../package.json');
var browserSync = require('browser-sync').create();

const initialize = function(){
    browserSync.init({
        server: { baseDir: pkg.config.dist }
    })
}

const reload = function(done){
    browserSync.reload();
    done();
}

module.exports = { initialize, reload, stream: browserSync.stream }
