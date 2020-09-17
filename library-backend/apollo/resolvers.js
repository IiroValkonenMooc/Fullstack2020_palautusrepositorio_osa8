const {  gql, UserInputError, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Author = require('../mongoose/schemas/Author')
const Book = require('../mongoose/schemas/Book')
const User = require('../mongoose/schemas/User')
const { PubSub } = require('apollo-server')


const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: () =>  Book.countDocuments({}),

    authorCount: () =>  Author.countDocuments({}),

    allBooks: async (root, args) => {
      if (!args.author&&!args.genre) {
        return  await Book.find({})
      } else {
        const found = await Book.find({})

        const filtered = found.filter(book => {
          if (book.author.name === args.author) {
            return true
          } else if (args.genre && book.genres.includes(args.genre)) {
            return true
          } else {
            return false
          }
        })

        return filtered
      }
    },

    allAuthors: async () => {
      let authors = await Author.find({ })

      // for (let i = 0; i < authors.length; i++) {
      //   authors[i].bookCount = await Book.find({ author: authors[i]._id }).countDocuments()
      // }

      return authors
    },

    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Book: {
    author: async (root) => {
      const foundAuthor = await Author.findById(root.author)

      return foundAuthor
    }
  },
  Author: {
    bookCount: async (root) => {
      const booksFound = await Book.find({ author: root._id }).countDocuments({ })

      return booksFound
    }
  },
  Mutation: {

    addBook: async (root, args, context) => {
      if(!context.currentUser){
        throw new AuthenticationError('not authenticated')
      }

      console.log('mutation args :>> ', args)
      const foundAuthor = await Author.findOne({ name: args.author })

      if(!foundAuthor){
        const newAuthor = new Author({ name: args.author })
        try {
          console.log('newAuthor :>> ', newAuthor)
          newAuthor.save()

          const newBook = new Book({ ...args, author: newAuthor._id })
          console.log('newBook :>> ', newBook)
          pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

          return newBook.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }

      try {
        const newBook = new Book({ ...args, author: foundAuthor._id })
        pubsub.publish('BOOK_ADDED', { bookAdded: newBook })
        return newBook.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },

    editAuthor: (root, args, context) => {
      if(!context.currentUser){
        throw new AuthenticationError('not authenticated')
      }

      try {
        const updatedAuthor = Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo }, { new: true })
        return updatedAuthor
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },

    createUser: (root, args) => {
      try {
        // const foundAuthor = Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo })
        const newUser = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
        return newUser.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },

    login: async (root, args) => {
      try {
        const foundUser = await User.findOne({ username: args.username })

        // eslint-disable-next-line no-undef
        if(foundUser && args.password === process.env.SUPERSECRETPASSWORD){
          const tokenData = {
            username: foundUser.username,
            id: foundUser._id
          }
          const token = jwt.sign(tokenData , process.env.SUPERSECRETTOKENPASSWORD)// eslint-disable-line no-undef

          return { value: token }
        } else {
          return null
        }
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    }
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers