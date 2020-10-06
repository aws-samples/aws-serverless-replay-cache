var assert = require('assert');
const application = require('../application/index');

const ps = {
  bucket: 'my-cache-bucket',
  rootAccessFileName: '_ROOT',
  queryStringSymbol: '#'
};

describe('Application', function() {
  
  let ec2Event;

  beforeEach(function() {
    ec2Event = {
      origin: {
        type: 'custom',
        domain: 'ec2-10-0-0-1.compute-1.amazonaws.com',
      },
      headers : {
        protocol: 'http'
      }      
    };
  });

  describe('EC2 Origin', function() {

    it('Accessing file', function() {
      let uri = '/index.html';
      ec2Event.uri = uri;
      ec2Event.querystring = '';

      const output = application.main(ec2Event, ps);
      assert.strictEqual(output.uri, uri);
      assert.strictEqual(output.querystring, '');
    });

    it('Accessing file with querystring', function() {
      let uri = '/index.html';
      let querystring = 'ver=1.0.0';
      ec2Event.uri = uri;
      ec2Event.querystring = querystring;

      const output = application.main(ec2Event, ps);
      assert.strictEqual(output.uri, uri);
      assert.strictEqual(output.querystring, querystring);
    });

  });

  describe('S3 Origin', function() {
   
    let s3Event;
    
    beforeEach(function() {
      s3Event = {
        origin: {
          type: 's3',
          domain: 'my-cache-bucket.s3.amazonaws.com',
        },
        headers : {
          protocol: 'http'
        }
      };

    });

    it('Accessing file', function() {
      let uri = '/index.html';
      s3Event.uri = uri;
      s3Event.querystring = '';

      const output = application.main(s3Event, ps);
      
      let expectedUri = `/${s3Event.headers.protocol}${uri}`;
      assert.strictEqual(output.uri, expectedUri);
      assert.strictEqual(output.querystring, null);
    });

    it('Accessing file with querystring', function() {
      let uri = '/index.html';
      let querystring = 'ver=1.0.0';
      s3Event.uri = uri;
      s3Event.querystring = querystring;

      const output = application.main(s3Event, ps);

      let encondedQueryString = encodeURIComponent(`${ps.queryStringSymbol}${querystring}`);
      let expectedUri = `/${s3Event.headers.protocol}${uri}${encondedQueryString}`;
      assert.strictEqual(output.uri, expectedUri);
      assert.strictEqual(output.querystring, '');
    });

    it('Accessing root directory', function() {
      let uri = '/';
      s3Event.uri = uri;
      s3Event.querystring = '';

      const output = application.main(s3Event, ps);
      
      let expectedUri = `/${s3Event.headers.protocol}${uri}${ps.rootAccessFileName}`;
      assert.strictEqual(output.uri, expectedUri);
      assert.strictEqual(output.querystring, null);
    });

    it('Accessing sub directory', function() {
      let uri = '/dir/';
      s3Event.uri = uri;
      s3Event.querystring = '';

      const output = application.main(s3Event, ps);
      
      let expectedUri = `/${s3Event.headers.protocol}${uri}${ps.rootAccessFileName}`;
      assert.strictEqual(output.uri, expectedUri);
      assert.strictEqual(output.querystring, null);
    });

  });

});
