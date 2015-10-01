var gulp = require('gulp');
var babel = require('gulp-babel');
var nodemon = require('gulp-nodemon');
var liverrelod = require('gulp-livereload');
var mocha = require('gulp-mocha');
var util = require('gulp-util');
var eslint = require('gulp-eslint');

gulp.task('babel', function () {
    return gulp.src('server/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest('dist/'));
});

gulp.task('watch', function () {
    gulp.watch('server/**/*.js', ['babel']);
});

gulp.task('lint', function () {
    return gulp.src(['server/**/*.js', 'static/**/*.js'])
        .pipe(eslint({
            useEslintrc: true
        }))
        .pipe(eslint.format());
});

gulp.task('test', function () {
    return gulp.src(['dist/test/**/*.js'], {read: false})
        .pipe(mocha({
            compilers: {
                js: babel
            },
            reporter: 'spec',
            ui: 'bdd'}))
        .on('error', util.log)
        .once('end', function () {
            process.exit();
        });
});

gulp.task('develop', function () {
    liverrelod.listen();
    nodemon({script: 'dist/index.js',
                ext: 'html js'
    }).on('restart', function () {
        console.log('restarted!');
    });
});

gulp.task('default', ['babel', 'lint', 'watch']);
