const {  gql, UserInputError } = require('apollo-server')
var mongoose = require('mongoose')
var Author = require('../mongoose/schemas/Author')
var Book = require('../mongoose/schemas/Book')

const resolvers = {
  Query: {
    bookCount: () =>  Book.countDocuments({}),
    authorCount: () =>  Author.countDocuments({}),
    allBooks: async (root, args) => {
      if (!args.author&&!args.genre) {
        return  await Book.find({}).populate('author')
      } else {
        const found = await Book.find({}).populate('author')

        const filtered = found.filter(book => {
          if (book.author.name === args.author) {
            return true
          } else if (args.genre && book.getMaxListeners.includes(args.genre)) {
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

      for (let i = 0; i < authors.length; i++) {
        authors[i].bookCount = await Book.find({ author: authors[i]._id }).countDocuments()
      }

      return authors
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      console.log('mutation args :>> ', args)
      const foundAuthor = await Author.findOne({ name: args.author })

      if(!foundAuthor){
        const newAuthor = new Author({ name: args.author })
        try {
          console.log('newAuthor :>> ', newAuthor)
          newAuthor.save()

          const newBook = new Book({ ...args, author: newAuthor._id })
          console.log('newBook :>> ', newBook)
          return newBook.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }

      try {
        const newBook = new Book({ ...args, author: foundAuthor._id })
        return newBook.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    editAuthor: (root, args) => {
      try {
        const foundAuthor = Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo })
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    }
  }
}

module.exports = resolvers