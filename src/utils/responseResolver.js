 isString = require('lodash/isString');

 responseResolver = async (response, statusCode = 200) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
      'Access-Control-Allow-Headers':
        'Access-Control-Allow-Headers,Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers,access-control-allow-origin,Access-Control-Allow-Origin'
    },
    body: isString(response) ? response : JSON.stringify({ ...response })
  };
};

module.exports = responseResolver;
