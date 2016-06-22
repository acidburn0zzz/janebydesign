var site = {
  title: "JGL",
  posts: []
};

var gulp             = require('gulp');
var plugins          = require('gulp-load-plugins')();
var del              = require('del');
var through          = require('through2');
var fs               = require('fs');

var extractTitleAndDate = require('./lib/extract-title-and-date');
var blogPostMeta = require('./lib/blog-post-meta');

var collectPosts = function() {
  var posts = [];

  return through.obj(function(file, enc, cb) {
    var post = file.page;
    var titleDate = extractTitleAndDate(file.relative);
    posts.push(post);
    post.title     = titleDate[0];
    post.date      = titleDate[1];
    post.body      = file.contents.toString();
    post.summary   = blogPostMeta.summarize(post.body);
    post.tags      = blogPostMeta.tags(post.tags);
    post.permalink = blogPostMeta.permalink(file.relative);
    this.push(file);
    cb();
  }, function(cb) {
    site.posts = posts;
    cb();
  });
};

gulp.task('blog', function() {
  return gulp.src('src/posts/**/*.md')
             .pipe(plugins.frontMatter({property: 'page', remove: true}))
             .pipe(plugins.data({site: site}))
             .pipe(plugins.markdown())
             .pipe(collectPosts())
             .pipe(plugins.wrap(function(data) {
                return fs.readFileSync('src/templates/blog.html').toString();
             }, null, {engine: 'nunjucks'}))
             .pipe(gulp.dest('dist/blog')); }); 

gulp.task('pages', ['blog'],function() {
  return gulp.src('src/pages/**/*.html')
             .pipe(plugins.data({site: site}))
             .pipe(plugins.nunjucksRender({
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
             .pipe(plugins.sourcemaps.init())
             .pipe(plugins.sass({outputStyle: 'compressed'}))
             .pipe(plugins.concat('app.min.css'))
             .pipe(plugins.sourcemaps.write())
             .pipe(gulp.dest('dist/css'));
});

gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
             .pipe(plugins.sourcemaps.init())
             .pipe(plugins.uglify())
             .pipe(plugins.concat('app.min.js'))
             .pipe(plugins.sourcemaps.write())
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
             .pipe(plugins.webserver({
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

gulp.task('default', plugins.sequence('clean', ['images', 'css', 'scripts'], 'blog', 'pages', ['serve', 'watch']));
