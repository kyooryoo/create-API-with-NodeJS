const assert = require('assert');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const server = require('./10_hapi_server');

const {
  experiment,
  test,
  before,
} = lab;

experiment('Base API', () => {
  test('GET: /', () => {
    const options = {
      method: 'GET',
      url: '/',
    };
    server.inject(options, (response) => {
      assert.equal(response.statusCode, 200);
      assert.equal(response.result.message, 'Hello World!');
    });
  });
});

experiment('Authentication', () => {
  test('GET: /todo without auth', () => {
    const options = {
      method: 'GET',
      url: '/todo'
    };
    server.inject(options, (response) => {
      assert.equal(response.statusCode, 401);
    });
  });
});

experiment('/todo/* routes', () => {
  const headers = {
    Authorization: 'Bearer ',
  };
  before(() => {
    const options = {
      method: 'POST',
      url: '/auth',
      payload: {
        email: 'user@example.com',
        password: 'P@ssw0rd',
      },
    };
    return new Promise((done) => {
      server.inject(options, (response) => {
        headers.Authorization += response.result.token;
        done();
      });
    });
  });

  test('GET: /todo', () => {
    const options = {
      method: 'GET',
      url: '/todo',
      headers: headers,
    };
    return new Promise((done) => {
      server.inject(options, (response) => {
        assert.equal(Array.isArray(response.result), true);
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });
});
