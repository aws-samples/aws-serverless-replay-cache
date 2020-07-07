const util = require('./util');

exports.main = async(event, ps, contentManager) => {
    //console.log(`Event: ${JSON.stringify(event)}`);
    const ROOT_ACCESS_FILE_NAME = ps.rootAccessFileName;
    const TABLE_NAME = ps.tableName;
    const MAX_CONTENT_LENGTH = ps.maxContentLength;
    const QUERY_STRING_SYMBOL = ps.queryStringSymbol;

    const request = event.request;
    const response = event.response;

    //console.log(`${request.origin};${request.method};${request.protocol};${request.host};${request.uri};${request.querystring};${response.status};${response.length}`);
    //console.log(`${isGetMethod(request.method)} | ${isCustomOrigin(request.origin)} |
    //    ${isStatusOk(response.status)} | ${isAllowedContentLength(response.length, MAX_CONTENT_LENGTH)}`);
    // if true will cache the content
    let result = {
        cached: false,
        response: null
    };

    if (isGetMethod(request.method) && isCustomOrigin(request.origin) &&
        isStatusOk(response.status) && isAllowedContentLength(response.length, MAX_CONTENT_LENGTH)) {

        let origin = {};
        origin.uri = util.buildCustomOriginURI(request);
        origin.hostHeader = request.hostHeader;
        let file = util.buildCacheFilename(request, ROOT_ACCESS_FILE_NAME, QUERY_STRING_SYMBOL);
        
        console.log(`Publishing content ${file}`);
        await contentManager.save(TABLE_NAME, file, origin);
        result.cached = true;
    } else if(isS3Origin(request.origin) && isStatusForbidden(response.status)) {
        // If S3 cannot find the object replicated it will return 403, we will replace by 503
        result.response = {
            status: '503',
            statusDescription: 'Service Unavailable',
            body: '',
            cacheControl: 'max-age=0, no-cache'
        };
    }

    return result;
};

/**
 * validation functions
 */
function isStatusOk(status) {
    return status == 200;
}

function isStatusForbidden(status) {
    return status == 403;
}

function isCustomOrigin(origin) {
    return origin == 'custom';
}

function isS3Origin(origin) {
    return origin == 's3';
}


function isGetMethod(method) {
    return method == 'GET';
}

function isAllowedContentLength(length, maxContentLength) {
    length = (length) ? Number(length):0; // type cast or treat as zero for undefined
    maxContentLength = Number(maxContentLength); // type cast
    return length == undefined // PHP doesn't return length
        || length <= maxContentLength;
}