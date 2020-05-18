// dependencies
const http = require('http');
const https = require('https');

exports.get = async function(uri) {
    console.log(`Downloading: ${uri}`);
    return new Promise((resolve, reject) => {
        let client = getHttpClient(uri);
        client.get(uri, (response) => {
            let contentType = response.headers['content-type'];
            let chunks = [];
            response.on('data', function (chunk) {
                chunks.push(Buffer.from(chunk, 'binary'));
            });
            response.on('end', function () {
                let content = {
                    type: contentType,
                    data: Buffer.concat(chunks)
                };
                resolve(content);
            });
        });
    });
};

function getHttpClient(uri) {
    return uri.startsWith('https') ? https:http;
}
