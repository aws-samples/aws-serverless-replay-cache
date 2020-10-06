// dependencies
const application = require('./application/index');
const eventParser = require('./adapter/originRequestEventParser');
const config = require('./config.json');

exports.handler = async(event) => { 
    //console.log(`Event: ${JSON.stringify(event)}`);
    
    let domainEvent = eventParser.parse(event);
    let output = application.main(domainEvent, config);
    
    let request = event.Records[0].cf.request;
    request.uri = output.uri;
    request.querystring = output.querystring;
    request.headers['host'][0].value = output.host;

    return request;
};
