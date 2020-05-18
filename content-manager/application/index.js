

exports.main = async(event, ps, httpClient, dataStore) => {
    const BUCKET = ps.bucket;

    let origin = event.origin;
    let file = event.file;

    let content = await httpClient.get(origin);
    let response = await dataStore.write(BUCKET, file, content.data, content.type);
    
    return response;  
};
