var site = {
  title: "My awesome blog/site",
  posts: []
};

var gulp             = require('gulp');
var del              = require('del');
var wrap             = require('gulp-wrap');
var data             = require('gulp-data');
var markdown         = require('gulp-markdown');
var sequence         = require('gulp-sequence');
var frontMatter      = require('gulp-front-matter');
var nunjucksRender   = require('gulp-nunjucks-render');
var sass             = require('gulp-sass');
//var imageminPngcrush = require('imagemin-pngcrush');
var uglify           = require('gulp-uglify');
var concat           = require('gulp-concat');
var sourcemaps       = require('gulp-sourcemaps');
var through          = require('through2');
var fs               = require('fs');
var watch            = require('gulp-watch');
var webserver        = require('gulp-webserver');


var summarize = function(text) {
  return text.split("<!--more-->")[0]
};

var permalink = function(path) {
  return "/blog/" + path;
};

var tags = function(str) {
  return str.split(",");
};

var collectPosts = function() {
  var posts = [];

  return through.obj(function(file, enc, cb) {
    var post = file.page;
    posts.push(post);
    post.body      = file.contents.toString();
    post.summary   = summarize(post.body);
    post.tags      = tags(post.tags);
    post.permalink = permalink(file.relative);
    this.push(file);
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
             .pipe(gulp.dest('dist/blog'));
});

gulp.task('pages', ['blog'],function() {
  return gulp.src('src/pages/**/*.html')
             .pipe(data({site: site}))
             .pipe(nunjucksRender({
               path: 'src/templates'
             }))
             .pipe(gulp.dest('dist'));
});

//gulp.task('minifyPng', function() {
//  return gulp.src('src/img/**/*.png')
//             .pipe(imageminPngcrush({reduce: true})())
//             .pipe(gulp.dest('dist/img'));
//});

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
  gulp.watch('src/img/**/*', ['images']);
  gulp.watch('src/sass/**/*.scss', ['css']);
  gulp.watch('src/**/*.html', ['pages', 'blog']);
  gulp.watch('src/posts/**/*.md', ['blog']);
});

gulp.task('serve', function() {
  return gulp.src('dist/')
             .pipe(webserver({
               port: 8000,
               host: '127.0.0.1',
               livereload: true,
               directoryListing: false,
               open: true
             }));
});

gulp.task('clean', function(cb) {
  return del(['dist'], cb);
});

gulp.task('default', sequence('clean', ['images', 'css', 'scripts'], 'blog', 'pages', ['serve', 'watch']));
