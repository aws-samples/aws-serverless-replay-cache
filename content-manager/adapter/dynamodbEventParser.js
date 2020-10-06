
/**
 * Adapter to parse DynamoDB Stream Event into a Domain Event.
 * Note: It only supports INSERT events.
 */
exports.parse = function (event) {

    let item = event.dynamodb.NewImage;
    let domainEvent = {
        request: {
                uri: item.uri.S,
                hostHeader: item.hostheader.S
            },
        file: item.file.S
    };
    
    return domainEvent;
};
