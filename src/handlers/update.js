const validateUserRequest = require('../utils/validateUserRequest')
const database = require('../services/database')

const update = async ({ pathParameters: { id }, body }) => {
  let updatedData

  try {
    updatedData = JSON.parse(body)
    await validateUserRequest.update(updatedData)
  } catch (err) {
    return {
      statusCode: 400,
      body: `user data not valid: ${err.message}`
    }
  }

  try {
    const updatedUser = await database.update(id, updatedData)

    return {
      statusCode: 200,
      body: JSON.stringify(updatedUser)
    }
  } catch (err) {
    return {
      statusCode: 404,
      body: 'User not found'
    }
  }
}

module.exports = {
  update
}
