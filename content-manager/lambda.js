// dependencies
const application = require('./application/index');
const config = require('./config.json');
const eventParser = require('./adapter/dynamodbEventParser');
const httpClient = require('./adapter/httpClient');
const dataStore = require('./adapter/s3DataStore');

let BUCKET_NAME = process.env.BUCKET_NAME;

exports.handler = async(event) => {
    //console.log(`Event: ${JSON.stringify(event)}`);
    
    let promises = [];
    
    let records = event.Records;
    for(let i=0; i < records.length; i++) {
        let record = records[i];
        if (record.eventName == 'INSERT' || record.eventName == 'MODIFY') { // Only threat inserts on the table
            let domainEvent = eventParser.parse(record);
            let promisse = await application.main(domainEvent, config, BUCKET_NAME, httpClient, dataStore);
            promises.push(promisse);    
        }
    }    

    return await Promise.all(promises); 
};
