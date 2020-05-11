// dependencies
const http = require('http');
const https = require('https');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const ps = require('aws-ssm-parameter-store-util');
const PARAMETERS_PATH = '/replay-cache';

exports.handler = async(event) => {
    //console.log(`Event: ${JSON.stringify(event)}`);
    await ps.init(PARAMETERS_PATH); // load ssm parameters
    const BUCKET = ps.bucket;

    let origin = event.origin;
    let file = event.file;

    let content = await executeHttpRequest(origin);
    let response = writeOnS3(file, content);
    
    return response;


    async function executeHttpRequest(uri) {
        console.log(`Downloading: ${uri}`)
        return new Promise((resolve, reject) => {
            let client = getHttpClient(uri);
            client.get(uri, (response) => {
                let contentType = response.headers['content-type'];
                let chunks = [];
                response.on('data', function(chunk) {
                    chunks.push(Buffer.from(chunk, 'binary'));
                });
                response.on('end', function() {
                    let content = {
                        type : contentType,
                        data : Buffer.concat(chunks)
                    }
                    resolve(content);
                });
            });
        });
    }

    async function writeOnS3(key, content) {
        let params = {
            Bucket: BUCKET,
            Key: key,
            ContentType: content.type,
            Body: content.data
        };
        console.log(`Writing content on S3: ${key}`);
        return await s3.upload(params).promise();
    }
    
    function getHttpClient(uri) {
        return uri.startsWith('https') ? https:http;
    }
};
