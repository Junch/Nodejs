var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');
var liverrelod = require('gulp-livereload');

gulp.task('babel', function () {
    return gulp.src('server/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function () {
    gulp.watch('server/**/*.js', ['babel']);
});

gulp.task('develop', function () {
    liverrelod.listen();
    nodemon({script: 'dist/index.js',
                ext: 'html js'
    }).on('restart', function () {
        console.log('restarted!');
    });
});

gulp.task('default', ['babel', 'develop', 'watch']);
