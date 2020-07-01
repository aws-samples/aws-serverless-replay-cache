// dependencies
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.write = async function(bucket, key, data, type) {
    //console.log(`Writing content on S3: ${key}`);
    let params = {
        Bucket: bucket,
        Key: key,
        Body: data,
        ContentType: type        
    };

    return await s3.upload(params).promise();
};