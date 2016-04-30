var gulp = require('gulp');
var jade = require('gulp-jade');
var htmlmin = require('gulp-htmlmin');
var sass = require('gulp-sass');
var connect = require('gulp-connect');
var runSequence = require('run-sequence');
var watch = require('gulp-watch');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
var coffee = require('gulp-coffee');
var source = require('vinyl-source-stream');
var browserify = require('browserify');

var config = {
  styles: './src/styles/**/*.scss',
  scripts: './src/scripts/**/*',
  pages: './src/pages/*.jade',
  templates: './src/templates/*.jade'
};

gulp.task('default', ['build', 'watch', 'connect']);
gulp.task('build', ['styles', 'pages', 'scripts', 'templates']);

gulp.task('connect', function() {
 connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('styles', function() {
  return gulp.src(config.styles)
    .pipe(sass())
    .pipe(gulp.dest('build/assets'))
});

gulp.task('pages', function() {
  return gulp.src(config.pages)
    .pipe(jade())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
});

gulp.task('scripts', function() {
  var bundleStream = browserify({
    entries: './src/scripts/main.coffee',
    extensions: ['.coffee'],
    transform: ["coffeeify"]
  }).bundle()

  return bundleStream
    .pipe(source('main.js'))
    .pipe(gulp.dest('./build/assets/'));
});

gulp.task('templates', function() {
  gulp.src(config.templates)
    .pipe(jade({
      client: true
    }))
    .pipe(declare({
      namespace: 'Templates',
      noRedeclare: true // Avoid duplicate declarations
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./build/assets'))
});

gulp.task('watch', function() {
  gulp.watch(config.styles,  ['styles']);
  gulp.watch(config.scripts, ['scripts']);
  gulp.watch(config.pages,   ['pages']);
  gulp.watch(config.templates,   ['templates']);

  watch('build/**').pipe(connect.reload());
});

