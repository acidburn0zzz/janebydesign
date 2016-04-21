var gulp       = require('gulp'),
    del        = require('del'),
    markdown   = require('gulp-markdown'),
    sequence   = require('gulp-sequence'),
    render     = require('gulp-nunjucks-render'),
    sass       = require('gulp-sass'),
    uglify     = require('gulp-uglify'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    watch      = require('gulp-watch'),
    webserver  = require('gulp-webserver');

gulp.task('blog', function() {
  return gulp.src('src/posts/**/*.md')
             .pipe(markdown())
             .pipe(gulp.dest('dist'));
});

gulp.task('pages', function() {
  return gulp.src('src/pages/**/*.html')
             .pipe(render({
               path: 'src/templates'
             }))
             .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
  return gulp.src('src/sass/**/*.scss')
             .pipe(sass({outputStyle: 'compressed'}))
             .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
             .pipe(sourcemaps.init())
             .pipe(uglify())
             .pipe(concat('app.min.js'))
             .pipe(sourcemaps.write())
             .pipe(gulp.dest('dist/js'));
});

// install a watcher here (gulp-watcher)
gulp.task('watch', ['css', 'pages', 'blog'], function() {
  gulp.watch('src/sass/**/*.scss', ['css']);
  gulp.watch('src/**/*.html', ['pages', 'blog']);
  gulp.watch('src/posts/**/*.md', ['blog']);
});

gulp.task('serve', function() {
  return gulp.src('dist/')
             .pipe(webserver({
               livereload: true,
               directoryListing: false,
               open: true
             }));
});

gulp.task('clean', function(cb) {
  return del(['dist'], cb);
});

gulp.task('default', sequence('clean', ['css', 'scripts'], ['blog', 'pages'], ['serve', 'watch']));
