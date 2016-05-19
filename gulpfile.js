var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var notifier = require('node-notifier');

var notify = function(error) {
  var message = 'In: ';
  var title = 'Error: ';

  if(error.description) {
    title += error.description;
  } else if (error.message) {
    title += error.message;
  }

  if(error.filename) {
    var file = error.filename.split('/');
    message += file[file.length-1];
  }

  if(error.lineNumber) {
    message += '\nLine: ' + error.lineNumber;
  }

  notifier.notify({title: title, message: message});
};

gulp.task('default', function() {
 var entryFile = './src/app.jsx';


  var bundler = browserify(entryFile, {extensions: [ ".js", ".jsx" ]});

  bundler.transform(babelify);

  var stream = bundler.bundle();
  stream.on('error', notify);

  stream
    .pipe(source(entryFile))
    .pipe(rename('index.js'))
    .pipe(gulp.dest('public/'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/**/*'], ['default']);
});
