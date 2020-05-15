
/**
 * Adapter to parse S3 Event into a Domain Event
 */
exports.parse = function (event) {

    const request = event.Records[0].cf.request;

    // request params
    let uri = request.uri;
    let querystring = request.querystring;

    let originType = (request.origin.s3 != null) ? 's3' : 'custom';
    let originDomain = request.origin[originType].domainName;

    let domainEvent = {
        "uri": uri,
        "querystring": querystring,
        "origin": {
            "type": originType,
            "domain": originDomain
        }
    };

    return domainEvent;
};
