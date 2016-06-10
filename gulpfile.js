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
var spritesmith = require('gulp.spritesmith');
var merge = require('merge-stream');
var sourcemaps = require('gulp-sourcemaps');
var GulpSSH = require('gulp-ssh')
var fs = require('fs');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var gzip = require('gulp-gzip');
var del = require('del');
var csso = require('gulp-csso');
var imagemin = require('gulp-imagemin');

var config = {
  styles: './src/styles/**/*.scss',
  scripts: './src/scripts/**/*',
  pages: './src/pages/*.jade',
  templates: './src/templates/*.jade',
  images: './src/images/*',
  fonts: './src/fonts/*',
  sprite: './src/icons/*.png'
};

gulp.task('default', ['build', 'watch', 'connect']);
gulp.task('build', ['styles', 'pages', 'scripts', 'templates', 'images', 'fonts', 'sprite']);

gulp.task('connect', function() {
 connect.server({
    root: 'build',
    livereload: true
  });
});

gulp.task('styles', ['sprite'], function() {
  return gulp.src('./src/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('build/assets'))
});

gulp.task('images', function() {
  return gulp.src(config.images)
    .pipe(gulp.dest('build/assets'))
});

gulp.task('fonts', function() {
  return gulp.src(config.fonts)
    .pipe(gulp.dest('build/assets'))
});

gulp.task('pages', function() {
  return gulp.src(config.pages)
    .pipe(jade())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'))
});

gulp.task('scripts', function() {
  browserify({
    entries: './src/scripts/main.coffee',
    extensions: ['.coffee'],
    transform: ["coffeeify"]
  }).bundle()
    .on('error', function (err) {
      console.log(err.toString());
      this.emit("end");
    })
    .pipe(source('main.js'))
    .pipe(gulp.dest('./build/assets/'));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src(config.sprite).pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css',
    padding: 6,
    cssTemplate: './spritesmith.template.mustache'
  }));

  var imgStream = spriteData.img.pipe(gulp.dest('build/assets'));
  var cssStream = spriteData.css.pipe(gulp.dest('./src/styles'));

  return merge(imgStream, cssStream)
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

var gulpSSH = new GulpSSH({
  ignoreErrors: false,
  sshConfig: {
    host: 'hw01.improvemedia.ru',
    port: 2233,
    username: 'inmyroom',
    privateKey: fs.readFileSync('/Users/user/.ssh/id_rsa')
  }
})

gulp.task('deploy', function() {
  runSequence('clean', 'build', 'productionJS', 'productionCSS', 'productionIMG', 'gzip', function() {
    gulp.src('./build/**')
      .pipe(gulpSSH.dest('/srv/remontsvtb24.inmyroom.ru'))
  })
})

gulp.task('productionJS', function() {
  gulp.src('./build/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./build/'))
})

gulp.task('productionCSS', function() {
  gulp.src('./build/**/*.css')
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(csso())
    .pipe(gulp.dest('./build/'))
})

gulp.task('productionIMG', function() {
  gulp.src(['./build/assets/*.jpg', './build/assets/*.png'])
    .pipe(imagemin())
    .pipe(gulp.dest('./build/assets/'))
})

gulp.task('gzip', function() {
  gulp.src('./build/**/*')
    .pipe(gzip())
    .pipe(gulp.dest('./build/'))
})

gulp.task('clean', function() {
  return del('./build/**/*')
})

gulp.task('watch', function() {
  gulp.watch(config.styles,    ['styles']);
  gulp.watch(config.scripts,   ['scripts']);
  gulp.watch('./src/pages/**',     ['pages']);
  gulp.watch(config.templates, ['templates']);
  gulp.watch(config.images,    ['images']);
  gulp.watch(config.fonts,     ['fonts']);
  gulp.watch(config.sprite,    ['sprite']);

  watch('build/**').pipe(connect.reload());
});

