const tap = require('gulp-tap');
const {relative} = require('path');

const {Endpoint, S3} = require('aws-sdk');

/**
 * Gulp plugin to tap a file in a stream and upload it to s3
 * @param {Object} [param0]
 * @param {String} param0.endpointUrl base endpoint url used to put the s3 object to
 * @param {String} param0.accessKeyId access key id to s3
 * @param {String} param0.secretAccessKey secrect access key to s3
 * @param {Object} param0.fileOptions additional options added to an object
 */
function uploadToS3({endpointUrl, accessKeyId, secretAccessKey, fileOptions} = {}) {
  const endpoint = new Endpoint(endpointUrl);
  const s3 = new S3({endpoint, accessKeyId, secretAccessKey});

  /**
   * Function to upload a file to s3
   * @param {File} file file to upload
   */
  function getFilePropertiesAndUpload(file) {
    // we only handle buffers for now (directories and other files are unsupported)
    if (file === null || file === undefined || !file.isBuffer()) return;

    // get file content to add to the upload
    const Key = relative(file.cwd, file.path)
    const Body = file.contents.toString();

    // upload the object
    s3.putObject({Key, Body, ...fileOptions}, (err, data) => {
      // if there is an error, throw it
      if (err) throw new Error(err);

      // else just log the data (usually an etag object)
      console.log(data);
    });
  }

  return tap(getFilePropertiesAndUpload);
}

/**
 * @exports
 */
module.exports = {uploadToS3};
