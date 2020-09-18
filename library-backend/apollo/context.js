const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../mongoose/schemas/User')
const Author = require('../mongoose/schemas/Author')
const Book = require('../mongoose/schemas/Book')
const DataLoader = require('dataloader')
var _ = require('lodash')

const context = async ({ req }) => {
  const bookCountLoader = new DataLoader( async authorIds => {
    return Book.find({  }).then( books => {
      //console.log('authorIds :>> ', authorIds)
      //console.log('books :>> ', books)
      let retArr = []
      for (let i = 0; i < authorIds.length; i++) {
        const author = authorIds[i]

        let bookCount = 0
        for (let j = 0; j < books.length; j++) {
          const book = books[j]

          if(author.toString() === book.author.toString()){
            console.log('stuff')
            bookCount++
          }
        }
        retArr.push(bookCount)
      }

      console.log('retArr :>> ', retArr);

      return retArr
    })
  })

  const auth = req ? req.headers.authorization : null

  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), process.env.SUPERSECRETTOKENPASSWORD // eslint-disable-line no-undef
    )

    const currentUser = await User.findById(decodedToken.id)
    return { currentUser, bookCountLoader }
  }

  return { bookCountLoader }
}

module.exports = context