
exports.main = (event, config) => {

    const ROOT_ACCESS_FILE_NAME = config.rootAccessFileName;
    const QUERY_STRING_SYMBOL = config.queryStringSymbol;

    let uri = event.uri;
    let querystring = event.querystring;
    let origin = event.origin;
    let host = event.headers.host;
    let protocol = event.headers.protocol;

    if (isS3Origin(origin.type)) {
        uri = `/${protocol}${uri}`;
        
        if (uri == '/' || uri.endsWith('/')) {
            uri += ROOT_ACCESS_FILE_NAME;
        }

        querystring = (querystring != "") ? `${QUERY_STRING_SYMBOL}${event.querystring}` : null;
        if (querystring) {
            uri += encodeURIComponent(querystring);
            querystring = "";
        }
        
        // If S3 is the origin (failover scenario), the host header must reflect S3 host to avoid signing error
        host = origin.domain;
    }

    let output = { "uri": uri, "querystring": querystring, "host": host};

    return output;
};


/**
 * validation functions
 */
function isS3Origin(type) {
    return type == 's3';
}