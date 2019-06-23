const gulp = require('gulp');
const del = require('del');

gulp.task('clean', () => del('public'));

gulp.task('copy', function() {
  return gulp.src('src/**/*', {allowEmpty: true})
      .pipe(gulp.dest('public'));
});

// right now all i do is copy, but i might transpile js and css later
gulp.task('ship', gulp.series('clean', 'copy'));
