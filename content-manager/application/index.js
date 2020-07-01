
exports.main = async(event, bucket, httpClient, dataStore) => {
    console.log(`Writing on ${JSON.stringify(bucket)} ${JSON.stringify(event)}`);

    let origin = event.origin;
    let file = event.file;

    let content = await httpClient.get(origin);
    let response = await dataStore.write(bucket, file, content.data, content.type);

    return response;  
};