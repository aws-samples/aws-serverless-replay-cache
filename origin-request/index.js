
const AWS = require('aws-sdk');

const ps = require('aws-ssm-parameter-store-util');
const PARAMETERS_PATH = '/replay-cache';


exports.handler = async(event) => {
    //console.log(`Event: ${JSON.stringify(event)}`);
    await ps.init(PARAMETERS_PATH); // load ssm parameters
    const BUCKET = ps.bucket;
    const ROOT_ACCESS_FILE_NAME = ps.rootAccessFileName;
    const QUERY_STRING_SYMBOL = ps.queryStringSymbol;
    
    let request = event.Records[0].cf.request;

    if (isS3Origin(request) && isReplayCacheBucket(request)) {
        if (request.uri == '/' || request.uri.endsWith('/')) {
            request.uri += ROOT_ACCESS_FILE_NAME;
        }

        let queryString = (request.querystring != "") ? `${QUERY_STRING_SYMBOL}${request.querystring}` : null;
        if (queryString) {
            request.uri += encodeURIComponent(queryString);
            request.querystring = "";
        }
        
        console.log(`Request URI: ${request.uri}`);
    }

    return request;


    /**
     * validation functions
     */
    function isS3Origin(request) {
        return request.origin.s3 != null;
    }

    function isReplayCacheBucket(request) {
        return request.origin.s3.domainName.startsWith(BUCKET);
    }

};
