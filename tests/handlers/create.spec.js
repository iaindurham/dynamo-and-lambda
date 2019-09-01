const database = require('../../src/services/database')
const { create } = require('../../src/handlers/create')
const { create: mockRequest } = require('../mocks/requests.mock')
const mockUsers = require('../mocks/user.mock')

describe('Handlers: create', () => {
  describe('When create is triggered with a valid user object in the request body', () => {
    test('Should add record THEN return 200 response with created record data', async () => {
      const dbCreateSpy = jest
        .spyOn(database, 'create')
        .mockResolvedValue(mockUsers.retrievedUser)
      const response = await create(mockRequest)

      expect(dbCreateSpy).toHaveBeenCalledWith(mockUsers.newUser)
      expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify(mockUsers.retrievedUser)
      })
    })
  })

  describe('When create is triggered with an invalid user object in the request body', () => {
    test('Should NOT create a record AND return a 400 error', async () => {
      const dbCreateSpy = jest.spyOn(database, 'create')
      const response = await create({
        body: JSON.stringify({
          asfdafs: 'wrong'
        })
      })

      expect(dbCreateSpy).not.toHaveBeenCalled()
      expect(response).toEqual({
        statusCode: 400,
        body: expect.stringContaining('user data not valid')
      })
    })
  })

  describe('When create is triggered with malformed JSON in the request body', () => {
    test('Should NOT create a record AND return a 400 error', async () => {
      const dbCreateSpy = jest.spyOn(database, 'create')
      const response = await create({
        body: '"not: "json'
      })

      expect(dbCreateSpy).not.toHaveBeenCalled()
      expect(response).toEqual({
        statusCode: 400,
        body: expect.stringContaining('user data not valid')
      })
    })
  })
})
