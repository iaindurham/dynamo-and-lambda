const mockNewUser = require('./user.mock').newUser

const create = {
  body: JSON.stringify({
    ...mockNewUser
  })
}

const get = {
  pathParameters: {
    id: '2342-234-23-365-45'
  }
}

const update = {
  ...get,
  body: JSON.stringify({
    firstName: 'Peter'
  })
}

module.exports = {
  create,
  delete: get,
  get,
  update
}
