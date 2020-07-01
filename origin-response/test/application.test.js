var assert = require('assert');
const application = require('../application/index');

const ps = {
    'rootAccessFileName': '_ROOT',
    'contentManagerFunctionArn': 'replay-cache-content-manager',
    'queryStringSymbol': '#',
    'maxContentLength': 5*1000*1000
};

let event = {
    'request': {
        'protocol': 'https',
        'method': 'GET',
        'uri': '/index.html',
        'querystring': '',
        'origin': 'custom',
        'host': 'ec2-10-0-0-1.compute-1.amazonaws.com'
    },
    'response': {
        'status': '200',
        'length': 50
    }
};

const contentManager = {
    save: () => {} // dummy function
};

describe('Application', function() {

    it('Success response', async function() {
        const output = await application.main(event, ps, contentManager);
        assert.equal(output.cached, true);
    });

    it('Request using POST method', async function() {
        event.request.method = 'POST';
        const output = await application.main(event, ps, contentManager);
        assert.equal(output.cached, false);
    });

    it('Response status is not 200', async function() {
        event.response.status = 202;
        const output = await application.main(event, ps, contentManager);
        assert.equal(output.cached, false);
    });

    it('Response length greater than allowed', async function() {
        event.response.length = ps.maxContentLength + 1;
        const output = await application.main(event, ps, contentManager);
        assert.equal(output.cached, false);
    });

    it('Origin is S3', async function() {
        event.request.origin = 's3';
        const output = await application.main(event, ps, contentManager);
        assert.equal(output.cached, false);
    });


});
