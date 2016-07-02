var gulp = require('gulp');
var exec = require('child_process').exec;
var fs = require('fs');
var fsPath = require('fs-path');

var copy = function(from, to) {
    return new Promise(function(resolve, reject){
        fsPath.copy(from, to, function(err) {
            if(err){
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

var runtsc = new Promise(function(resolve, reject) {
    exec('tsc', function(err) {
        if (err) {
            console.error(err);
        }
        resolve();
    });
});

gulp.task('default', function() {
    var watcher = gulp.watch(['app/*', 'app/nls/*', 'ref/css/app.css'], ['copytodjango']);
    watcher.on('change', function(event) {
        console.info('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('copytodjango', function () {
    runtsc
    .then(function() {
        return copy('app.js', '../QuickFinance/quick/static/quick/app.js');
    })
    .then(function() {
        return copy('app.js.map', '../QuickFinance/quick/static/quick/app.js.map');
    })
    .then(function() {
        return copy('ref/css/app.css', '../QuickFinance/quick/static/quick/ref/css/app.css');
    })
    .then(function() {
        return new Promise(function(resolve, reject) {
            fs.readFile('../QuickFinance/quick/static/quick/app.js', function(err, data) {
               if(err) {
                   reject(err);
               } else {
                   data = data.toString();
                   data = data.replace(/app\/nls\/langResource.js/g, 'static/quick/app/nls/langResource.js');
                   resolve(data);
               }
            });
        });
    })
    .then(function(data) {
        return new Promise(function(resolve, reject) {
            fs.writeFile('../QuickFinance/quick/static/quick/app.js', data, function(err) {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    })
    .then(function() {
        return copy('app', '../QuickFinance/quick/static/quick/app');
    })
    .catch(function(err) {
        console.error(err);
    });
});