const logger = {
  // Fires whenever a GraphQL request is received from a client.
  requestDidStart(requestContext) {
    console.log('Request started! Query:\n' +
      requestContext.request.query) + '\n\n\n------------------------------------------------'
  },
}

module.exports = logger