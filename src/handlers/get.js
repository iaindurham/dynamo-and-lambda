const database = require('../services/database')

const get = async ({ pathParameters: { id } }) => {
  const user = await database.get(id)

  if (!user) {
    return {
      statusCode: 404,
      body: 'User not found'
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(user)
  }
}

module.exports = {
  get
}
