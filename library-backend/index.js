const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()
const typeDefs = require('./apollo/typeDefs')
const resolvers = require('./apollo/resolvers')
const context = require('./apollo/context')
const logger = require('./apollo/plugins/logger')

// eslint-disable-next-line no-undef
mongoose.connect( process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  plugins: [
    logger
  ],
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})