var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var mocha = require('gulp-mocha');
var util = require('gulp-util');
const jscs = require('gulp-jscs');

gulp.task('sass', function () {
  gulp.src('./public/css/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('watch', function () {
  gulp.watch('./public/css/*.scss', ['sass']);
});

gulp.task('test', function () {
  return gulp.src(['test/*.js'], {read: false})
      .pipe(mocha({
          reporter: 'spec',
          ui: 'bdd'}))
      .on('error', util.log)
        .once('end', function () {
          process.exit();
        });
});

gulp.task('style', () => {
  return gulp.src('**/*.js')
      .pipe(jscs({fix: true}))
      .pipe(jscs.reporter())
      .pipe(jscs.reporter('fail'))
      .pipe(gulp.dest('.'));
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'js ejs coffee',
    stdout: false
  }).on('readable', function () {
    this.stdout.on('data', function (chunk) {
      if (/^Express server listening on port/.test(chunk)){
        livereload.changed(__dirname);
      }
    });
    this.stdout.pipe(process.stdout);
    this.stderr.pipe(process.stderr);
  });
});

gulp.task('default', [
  'sass',
  'develop',
  'watch'
]);
