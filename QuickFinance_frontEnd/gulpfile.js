var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('default', function() {
    var watcher = gulp.watch('app/*', ['runtsc', 'copytodjango', 'renamevar']);
    watcher.on('change', function(event) {
        console.info('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('runtsc', function() {
    exec('tsc', function(err) {
        if (err) {
            console.error(err);
        }
    });
});

gulp.task('copytodjango', function () {
    exec('cp -r app.js app.js.map app ../QuickFinance/quick/static/quick/', function(err) {
        if (err) {
            console.error(err);
        }
    });
});

gulp.task('renamevar', function() {
    
});