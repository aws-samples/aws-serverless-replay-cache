## AWS SSM Pameter Store Util
Utility package to retrieve path based parameters from AWS SSM Parameter Store.

## Install
```
npm install aws-ssm-parameter-store-util
```

## Usage
Systems Manager Parameter Store
```
Parameter Name: /hello/greetings
Parameter Value: Hello World!
```

Node.JS
```
const ps = require('aws-ssm-parameter-store-util');
const PARAMETERS_PATH = '/hello';

# Will return 'Hello World!'
exports.handler = async(event) => {
    return ps.greetings;
}
```
_Note: If not executed from AWS Lambda, the 'aws-sdk' package must be imported._

## Uninstall
```
npm unistall aws-ssm-parameter-store-util
```