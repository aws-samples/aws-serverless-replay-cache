// dependencies
const application = require('./application/index');
const config = require('./config.json');
const eventParser = require('./adapter/originResponseEventParser');
const contentManager = require('./adapter/dynamodbContentManager');

exports.handler = async(event) => {
    //console.log(`Event: ${JSON.stringify(event)}`);
   
    let domainEvent = eventParser.parse(event);
    let result = await application.main(domainEvent, config, contentManager);

    let response = event.Records[0].cf.response;
    let updatedResponse = result.response;
    if(updatedResponse) {
        response.status = updatedResponse.status;
        response.statusDescription = updatedResponse.statusDescription;
        response.body = updatedResponse.body;
        response.headers['cache-control'] = [{
                key: 'Cache-Control',
                value: updatedResponse.cacheControl
            }];
    }
    
    return response;
};
