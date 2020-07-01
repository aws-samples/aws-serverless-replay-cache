
exports.main = (event, config) => {

    const ROOT_ACCESS_FILE_NAME = config.rootAccessFileName;
    const QUERY_STRING_SYMBOL = config.queryStringSymbol;

    let uri = event.uri;
    let querystring = event.querystring;
    let origin = event.origin;
    let host;

    if (isS3Origin(origin.type)) {
        if (uri == '/' || uri.endsWith('/')) {
            uri += ROOT_ACCESS_FILE_NAME;
        }

        querystring = (querystring != "") ? `${QUERY_STRING_SYMBOL}${event.querystring}` : null;
        if (querystring) {
            uri += encodeURIComponent(querystring);
            querystring = "";
        }
        
        host = origin.domain;
    }

    let output = { "uri": uri, "querystring": querystring, "host": host};
    //console.log(`Processed Request: ${JSON.stringify(output)}`);
   
    return output;
};


/**
 * validation functions
 */
function isS3Origin(type) {
    return type == 's3';
}