const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

var init = false;

exports.init = async function(path) {
    if (!init) {
        console.log('Loading parameters from SSM');
        let data = await getParametersFromStore(path);
        exportParameters(data);
    } else {
        console.log('Parameters already initialized, nothing to load.');
    }
}

async function getParametersFromStore(path) {
    let params = {
        Path: path
    };

    return new Promise((resolve, reject) => {
        ssm.getParametersByPath(params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                //console.log(data); // successful response
                resolve(data.Parameters);
            }
        });
    });
}

function exportParameters(data) {
    for (let i = 0; i < data.length; i++) {
        let parameter = data[i];
        let key = parameter.Name.split('/');
        let property = key[key.length - 1];
        let value = parameter.Value;
        exports[property] = value;
    }
    init = true;
}
