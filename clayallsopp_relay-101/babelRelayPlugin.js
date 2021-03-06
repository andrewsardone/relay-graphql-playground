const babelRelayPlugin   = require('babel-relay-plugin');
const introspectionQuery = require('graphql/utilities').introspectionQuery;
const request            = require('sync-request');

const graphqlHubUrl = 'http://www.GraphQLHub.com/graphql';
const response = request('GET', graphqlHubUrl, {
  qs: {
    query: introspectionQuery
  }
});

const schema = JSON.parse(response.body.toString('utf-8'));

module.exports = babelRelayPlugin(schema.data, {
  abortOnError: true,
});
