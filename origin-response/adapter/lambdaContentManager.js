const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.save = async function(functionArn, file, origin) {
    let params = {
        FunctionName: functionArn,
        InvocationType: "Event",
        Payload: JSON.stringify({
            "file": file,
            "origin": origin
        })
    };

    return await lambda.invoke(params).promise();    
};