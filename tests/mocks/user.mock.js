const newUser = {
  firstName: 'Fred',
  lastName: 'Smith',
  email: 'f@s.com',
  credentials: 'asfdasfwfsadfsa'
}

const createdUser = {
  ...newUser,
  id: expect.any(String)
}

const { credentials, ...retrievedUser } = createdUser

module.exports = {
  createdUser,
  newUser,
  retrievedUser
}
