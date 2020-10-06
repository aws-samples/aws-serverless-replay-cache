// dependencies
const http = require('http');
const https = require('https');

exports.get = async function(request) {
    //console.log(`Downloading ${JSON.stringify(origin)}`);

    let uri = request.uri;
    let hostHeader = request.hostHeader;
    let verifyCertificate = request.verifyCertificate;
    
    return new Promise((resolve, reject) => {
        let options = {
            rejectUnauthorized: verifyCertificate,
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
            
        }).on('error', (err) => {
            console.log(`Error: ${err}`);
        });
    });
};

function getHttpClient(uri) {
    return uri.startsWith('https') ? https:http;
}
