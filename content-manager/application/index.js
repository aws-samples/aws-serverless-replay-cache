
exports.main = async(event, config, bucket, httpClient, dataStore) => {
    console.log(`Writing on ${JSON.stringify(bucket)} ${JSON.stringify(event)}`);
    
    let request = event.request;
    let file = event.file;
    
    request.verifyCertificate = config.verifyCertificate;

    let content = await httpClient.get(request);
    let response = await dataStore.write(bucket, file, content.data, content.type);

    return response;  
};