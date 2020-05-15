// dependencies
const eventParser = require('./adapter/originRequestEventParser');
const application = require('./application/index');
const ps = require('aws-ssm-parameter-store-util');

const PARAMETERS_PATH = '/replay-cache';


exports.handler = async(event) => { 
    console.log(`Event: ${JSON.stringify(event)}`);
    
    await ps.init(PARAMETERS_PATH); // load ssm parameters
    let domainEvent = eventParser.parse(event);
    let output = application.main(domainEvent, ps);

    let request = event.Records[0].cf.request;
    request.uri = output.uri;
    request.querystring = output.querystring;

    return request;

};
