// dependencies
const httpClient = require('./adapter/httpClient');
const dataStore = require('./adapter/s3DataStore');
const application = require('./application/index');
const ps = require('aws-ssm-parameter-store-util');

const PARAMETERS_PATH = '/replay-cache';

exports.handler = async(event) => {
    console.log(`Event: ${JSON.stringify(event)}`);
    
    await ps.init(PARAMETERS_PATH); // load ssm parameters
    let response = await application.main(event, ps, httpClient, dataStore);

    return response;  
};
