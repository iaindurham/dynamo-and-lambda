const database = require('../../src/services/database')
const { get } = require('../../src/handlers/get')
const { get: mockRequest } = require('../mocks/requests.mock')
const mockUsers = require('../mocks/user.mock')

describe('Handlers: get', () => {
  describe('When get is triggered with an existing users id as a path parameter', () => {
    test('Should add record THEN return 200 response with retrieved record data', async () => {
      const dbGetSpy = jest
        .spyOn(database, 'get')
        .mockResolvedValue(mockUsers.retrievedUser)
      const response = await get(mockRequest)

      expect(dbGetSpy).toHaveBeenCalledWith(mockRequest.pathParameters.id)
      expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify(mockUsers.retrievedUser)
      })
    })
  })

  describe('When get is triggered with an id for a user that does not exist as a path parameter', () => {
    test('Should NOT get a record AND return a 404 error', async () => {
      const dbGetSpy = jest.spyOn(database, 'get').mockResolvedValue(null)
      const response = await get(mockRequest)

      expect(dbGetSpy).toHaveBeenCalledWith(mockRequest.pathParameters.id)
      expect(response).toEqual({
        statusCode: 404,
        body: 'User not found'
      })
    })
  })
})
