var gulp = require('gulp'),
    markdown = require('gulp-markdown'),
    render = require('gulp-nunjucks-render'),
    sass = require('gulp-sass'),
    webserver = require('gulp-webserver');


gulp.task('default', ['blog', 'pages', 'server']);

gulp.task("blog", function() {
  return gulp.src('src/posts/**/*.md')
             .pipe(markdown())
             .pipe(gulp.dest('dist'));
});

gulp.task('pages', function() {
  return gulp.src("src/pages/**/*.html")
             .pipe(render({
               path: 'src/templates'
             }))
             .pipe(gulp.dest('dist'));
});

gulp.task("css", function() {
  return gulp.src("src/sass/**/*.scss")
             .pipe(sass({outputStyle: 'compressed'}))
             .pipe(gulp.dest('dist/css'));
});

// install a watcher here (gulp-watcher)

gulp.task('server', function() {
  return gulp.src('dist/')
             .pipe(webserver({
               livereload: true,
               directoryListing: false,
               open: true
             }));
});
