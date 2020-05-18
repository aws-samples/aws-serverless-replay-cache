const util = require('./util');

exports.main = async(event, ps, contentManager) => {
    //console.log(`Event: ${JSON.stringify(event)}`);
    const ROOT_ACCESS_FILE_NAME = ps.rootAccessFileName;
    const CONTENT_MANAGER_FUNCTION_ARN = ps.contentManagerFunctionArn;
    const MAX_CONTENT_LENGTH = ps.maxContentLength * 1000 * 1000; // converting MB in Bytes
    const QUERY_STRING_SYMBOL = ps.queryStringSymbol;

    const request = event.request;
    const response = event.response;

    //console.log(`${request.origin};${request.method};${request.protocol};${request.host};${request.uri};${request.querystring};${response.status};${response.length}`);

    // if true will cache the content
    let cached = false;
    if (isGetMethod(request.method) && isCustomOrigin(request.origin) &&
        isStatusOk(response.status) && isAllowedContentLength(response.length, MAX_CONTENT_LENGTH)) {

        let origin = util.buildCustomOriginURI(request);
        let file = util.buildCacheFilename(request, ROOT_ACCESS_FILE_NAME, QUERY_STRING_SYMBOL);

        //console.log(`Invoking ${CONTENT_MANAGER_FUNCTION_ARN} for ${file}: ${origin}`);
        await contentManager.save(CONTENT_MANAGER_FUNCTION_ARN, file, origin);
        cached = true;
    }

    return { 'cached': cached };
};

/**
 * validation functions
 */
function isStatusOk(status) {
    return status == 200;
}

function isCustomOrigin(origin) {
    return origin == 'custom';
}

function isGetMethod(method) {
    return method == 'GET';
}

function isAllowedContentLength(length, maxContentLength) {
    return length == undefined // PHP doesn't return length
        ||
        length <= maxContentLength;
}
