
exports.main = (event, ps) => {

    const BUCKET = ps.bucket;
    const ROOT_ACCESS_FILE_NAME = ps.rootAccessFileName;
    const QUERY_STRING_SYMBOL = ps.queryStringSymbol;

    let uri = event.uri;
    let querystring = event.querystring;
    let origin = event.origin;

    if (isS3Origin(origin.type) && isCacheBucketOrigin(origin.domain, BUCKET)) {
        if (uri == '/' || uri.endsWith('/')) {
            uri += ROOT_ACCESS_FILE_NAME;
        }

        querystring = (querystring != "") ? `${QUERY_STRING_SYMBOL}${event.querystring}` : null;
        if (querystring) {
            uri += encodeURIComponent(querystring);
            querystring = "";
        }
    }

    let output = { "uri": uri, "querystring": querystring };
    console.log(`Processed Request: ${JSON.stringify(output)}`);
   
    return output;
};


/**
 * validation functions
 */
function isS3Origin(type) {
    return type == 's3';
}

function isCacheBucketOrigin(domain, bucket) {
    return domain.split('.')[0] == bucket;
}