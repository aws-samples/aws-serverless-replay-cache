/**
 * Generates a URI from a request object treating query string if they exist.
 */
exports.buildCustomOriginURI = function (request) {
    let uri = `${request.protocol}://${request.host}${request.uri}`;

    let querystring = request.querystring;
    if (querystring != '') {
        uri += `?${querystring}`; // custom origin uses ? as query string id
    }

    return uri;
};

/**
 * Generates a filename from a request object treating query string and root access if they exist.
 */
exports.buildCacheFilename = function (request, rootAccessFileName, queryStringSymbol) {
    let uri = request.uri;
    let querystring = request.querystring;

    let file = uri.substr(1);

    // handles access to directories
    if (uri == '/' || uri.endsWith('/')) {
        file += rootAccessFileName;
    }

    if (querystring != '') {
        file += `${queryStringSymbol}${querystring}` // S3 Cache origin uses query string id different of ?
    }

    return file;
};