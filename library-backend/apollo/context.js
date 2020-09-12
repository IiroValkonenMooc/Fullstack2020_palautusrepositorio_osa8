const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('../mongoose/schemas/User')

const context = async ({ req }) => {
  const auth = req ? req.headers.authorization : null

  if (auth && auth.toLowerCase().startsWith('bearer ')) {
    const decodedToken = jwt.verify(
      auth.substring(7), process.env.SUPERSECRETTOKENPASSWORD // eslint-disable-line no-undef
    )

    const currentUser = await User.findById(decodedToken.id)
    return { currentUser }
  }
}

module.exports = context