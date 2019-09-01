const validateUserRequest = require('../utils/validateUserRequest')
const database = require('../services/database')

const create = async ({ body }) => {
  let userData

  try {
    userData = JSON.parse(body)
    await validateUserRequest.add(userData)
  } catch (err) {
    return {
      statusCode: 400,
      body: `user data not valid: ${err.message}`
    }
  }

  const createdUser = await database.create(userData)

  return {
    statusCode: 200,
    body: JSON.stringify(createdUser)
  }
}

module.exports = {
  create
}
