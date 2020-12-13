const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB;

const TTL = 60*1000; // TTL in miliseconds

exports.save = async function(table, file, origin) {

    let params = {
        TableName: table
    };

    let timestamp = Math.floor((Date.now()+TTL)/1000); // get current ime in millis and add the TTL
    
    params = {
        TableName: table,
        Item: {
            "uri": {
                S: origin.uri
            },
            "hostheader": {
                S: origin.hostHeader
            },
            "file": {
                S: file
            },
            "ttl": {
                N: timestamp.toString()
            }
        }
    };
    
    return await dynamodb.putItem(params).promise()
        .catch(err => {
            if (err.code == 'ResourceNotFoundException') {
                console.warn(`Content could not be published! DynamoDB Global Table Replica ${table} doesn't exists in this region.`);
            } else {
                console.log(err);
            }
        });
    
};
