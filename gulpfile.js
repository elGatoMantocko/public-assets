const gulp = require('gulp');
const del = require('del');
const {uploadToS3} = require('./utils/upload-to-s3');

const endpointUrl = process.env.S3_ENDPOINT_URL;

const fileOptions = {
  ACL: 'public-read',
  Bucket: process.env.S3_BUCKET,
  ContentDisposition: 'inline',
};

// s3 access stored in environment
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const uploadOpts = {endpointUrl, fileOptions, accessKeyId, secretAccessKey};

gulp.task('clean', () => del('public'));

gulp.task('copy', function() {
  return gulp.src('src/**/*', {allowEmpty: true})
      .pipe(gulp.dest('public'));
});

gulp.task('upload', function() {
  return gulp.src('**/*', {allowEmpty: true, cwd: 'public'})
      .pipe(uploadToS3(uploadOpts));
});

// right now all i do is copy, but i might transpile js and css later
gulp.task('ship', gulp.series('clean', 'copy'));
