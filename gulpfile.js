var site = {
  title: "My awesome blog/site",
  posts: []
};


var gulp       = require('gulp');
var del        = require('del');
var     wrap   = require('gulp-wrap');
var     data   = require('gulp-data'),
    markdown   = require('gulp-markdown'),
    sequence   = require('gulp-sequence'),
  frontMatter  = require('gulp-front-matter'),
nunjucksRender = require('gulp-nunjucks-render'),
    sass       = require('gulp-sass'),
    uglify     = require('gulp-uglify'),
    concat     = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
      through  = require('through2'),
      fs  = require('fs'),
    watch      = require('gulp-watch'),
    webserver  = require('gulp-webserver');


var summarize = function(text) {
  return text.split("<!--more-->")[0]
};

var permalink = function(path) {
  return "/blog/" + path;
};

var collectPosts = function() {
  var posts = [];

  return through.obj(function(file, enc, cb) {
    var post = file.page;
    post.body = file.contents.toString();
    post.summary = summarize(post.body);
    post.permalink = permalink(file.relative);
    posts.push(post);
    cb();
  }, function(cb) {
    site.posts = posts;
    cb();
  });
};

gulp.task('blog', function() {
  return gulp.src('src/posts/**/*.md')
             .pipe(frontMatter({property: 'page', remove: true}))
             .pipe(data({site: site}))
             .pipe(markdown())
             .pipe(collectPosts())
             .pipe(wrap(function(data) {
                return fs.readFileSync('src/templates/blog.html').toString();
             }, null, {engine: 'nunjucks'}))
             .pipe(gulp.dest('dist/blog'))
             ;
});

gulp.task('pages', ['blog'],function() {
  return gulp.src('src/pages/**/*.html')
             .pipe(data({site: site}))
             .pipe(nunjucksRender({
               path: 'src/templates'
             }))
             .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
             .pipe(gulp.dest('dist/img'));
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

gulp.task('default', sequence('clean', ['images', 'css', 'scripts'], 'blog', 'pages', ['serve', 'watch']));
