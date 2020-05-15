// dependencies
const eventParser = require('./adapter/originResponseEventParser');
const contentManager = require('./adapter/lambdaContentManager');
const application = require('./application/index');
const ps = require('aws-ssm-parameter-store-util');

const PARAMETERS_PATH = '/replay-cache';

exports.handler = async(event) => {
    console.log(`Event: ${JSON.stringify(event)}`);
    await ps.init(PARAMETERS_PATH); // load ssm parameters
    
    let domainEvent = eventParser.parse(event);
    await application.main(domainEvent, ps, contentManager);

    return event.Records[0].cf.response;
};
