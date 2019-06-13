const tap = require('gulp-tap');
const {relative} = require('path');

const {Endpoint, S3} = require('aws-sdk');

function uploadToS3({endpointUrl, accessKeyId, secretAccessKey, fileOptions} = {}) {
  const endpoint = new Endpoint(endpointUrl);
  const s3 = new S3({endpoint, accessKeyId, secretAccessKey});

  /**
   * Function to upload a file to s3
   * @param {File} file file to upload
   */
  function uploadFile(file) {
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

  return tap(uploadFile);
}

module.exports = {uploadToS3};
