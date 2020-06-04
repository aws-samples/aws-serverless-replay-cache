
/**
 * Adapter to parse S3 Event into a Domain Event
 */
exports.parse = function(event) {

    const request = event.Records[0].cf.request;
    const response = event.Records[0].cf.response;
    // request params
    let origin = (request.origin.s3 != null) ? 's3':'custom';
    let protocol = request.origin[origin].protocol;
    let host = request.origin[origin].domainName;
    let hostHeader = request.headers['host'][0].value;
    let method = request.method;
    let uri = request.uri;
    let querystring = request.querystring;

    // response params
    let status = response.status;
    let length = response.headers['content-length'];
    if (length) length = length[0].value;

    let domainEvent = {
        "request": {
            "protocol": protocol,
            "host": host,
            "hostHeader": hostHeader,
            "method": method,
            "uri": uri,
            "querystring": querystring,
            "origin": origin
        },
        "response": {
            "status": status,
            "length": length
        }
    };

    return domainEvent;
};
