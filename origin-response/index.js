const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

const ps = require('aws-ssm-parameter-store-util');
const PARAMETERS_PATH = '/replay-cache';

exports.handler = async(event) => {
    //console.log(`Event: ${JSON.stringify(event)}`);
    await ps.init(PARAMETERS_PATH); // load ssm parameters
    const ROOT_ACCESS_FILE_NAME = ps.rootAccessFileName;
    const CONTENT_MANAGER_FUNCTION_ARN = ps.contentManagerFunctionArn;
    const MAX_CONTENT_LENGTH = ps.maxContentLength;
    const QUERY_STRING_SYMBOL = ps.queryStringSymbol;

    const response = event.Records[0].cf.response;
    const request = event.Records[0].cf.request;
    
    if (response.status == 200 && isS3Origin(request) == false) {
        let protocol = request.origin.custom.protocol;
        let host = request.origin.custom.domainName;
        let method = request.method;
        let uri = request.uri;
        let queryString = request.querystring;
        
        let length = response.headers['content-length'];
        if (length) length = length[0].value;

        console.log(`${method}|${protocol}|${host}|${uri}|${queryString}|${length}`);
        if (isAllowedMethod(method) && isAllowedContentLength(length)) {
            
            let origin = `${protocol}://${host}${uri}`;
            let file = uri.substr(1);
            
            // handles access to directories
            if(uri == '/' || uri.endsWith('/')) {
                file += ROOT_ACCESS_FILE_NAME;
            }
        

            if(queryString != '') {
                origin += `?${queryString}`; // master origin uses ? as query string id
                file += `${QUERY_STRING_SYMBOL}${queryString}` // slave origin uses # as query string id
            }
            
            let params = {
                FunctionName: CONTENT_MANAGER_FUNCTION_ARN,
                InvocationType: "Event",
                Payload: JSON.stringify({
                    "origin": origin,
                    "file": file
                })
            };

            console.log(`Invoking ${CONTENT_MANAGER_FUNCTION_ARN} ${params.Payload}`);
            await lambda.invoke(params).promise();
        }
        
    }

    return response;

    /**
     * validation functions
     */
    function isS3Origin(request) {
        return request.origin.s3 != null;
    }

    function isAllowedMethod(method) {
        return method == 'GET';
    }

    function isAllowedContentLength(length) {
        return length == undefined || // PHP doesn't return lenght
            length <= MAX_CONTENT_LENGTH;
    }

};
