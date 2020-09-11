const { ApolloServer, gql } = require('apollo-server')
const mongoose = require('mongoose')
require('dotenv').config()
const typeDefs = require('./apollo/typeDefs')
const resolvers = require('./apollo/resolvers')

// eslint-disable-next-line no-undef
mongoose.connect( process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})