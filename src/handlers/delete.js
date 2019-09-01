const database = require('../services/database')

const del = async ({ pathParameters: { id } }) => {
  const user = await database.get(id)

  if (!user) {
    return {
      statusCode: 404,
      body: 'User not found'
    }
  }

  await database.del(id)

  return {
    statusCode: 200,
    body: `Deleted user ${id}`
  }
}

module.exports = {
  del
}
