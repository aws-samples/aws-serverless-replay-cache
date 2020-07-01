// dependencies
const application = require('./application/index');
const eventParser = require('./adapter/originRequestEventParser');
const config = require('./config.json');

exports.handler = async(event) => { 
    console.log(`Event: ${JSON.stringify(event)}`);
    
    let domainEvent = eventParser.parse(event);
    let output = application.main(domainEvent, config);

    let request = event.Records[0].cf.request;
    request.uri = output.uri;
    request.querystring = output.querystring;
    
    let host = output.host;
    if(host) { // If it's a failover scenario, S3 domain must be enforced in the headers to avoid signing issues with S3
        request.headers['host'][0].value = host;
    }

    return request;

};
