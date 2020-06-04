// dependencies
const http = require('http');
const https = require('https');

exports.get = async function(origin) {
    let uri = origin.uri;
    let hostHeader = origin.hostHeader;
    
    console.log(`Downloading: ${uri}`);
    return new Promise((resolve, reject) => {
        let options = { 
            headers: {
                'Host': hostHeader
            }
        };
        let client = getHttpClient(uri);
        client.get(uri, options, (response) => {
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
