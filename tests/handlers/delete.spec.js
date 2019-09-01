const database = require('../../src/services/database')
const { del } = require('../../src/handlers/delete')
const { delete: mockRequest } = require('../mocks/requests.mock')
const mockUsers = require('../mocks/user.mock')

describe('Handlers: delete', () => {
  describe('When delete is triggered with an existing users id as a path parameter', () => {
    test('Should add record THEN return 200 response with retrieved record data', async () => {
      const dbGetSpy = jest
        .spyOn(database, 'get')
        .mockResolvedValue(mockUsers.retrievedUser)
      const dbDeleteSpy = jest.spyOn(database, 'del').mockResolvedValue()
      const response = await del(mockRequest)

      const userId = mockRequest.pathParameters.id

      expect(dbGetSpy).toHaveBeenCalledWith(userId)
      expect(dbDeleteSpy).toHaveBeenCalledWith(userId)
      expect(response).toEqual({
        statusCode: 200,
        body: `Deleted user ${userId}`
      })
    })
  })

  describe('When delete is triggered with an id for a user that does not exist as a path parameter', () => {
    test('Should NOT del a record AND return a 404 error', async () => {
      const dbGetSpy = jest.spyOn(database, 'get').mockResolvedValue(null)
      const dbDeleteSpy = jest.spyOn(database, 'del').mockResolvedValue()
      const response = await del(mockRequest)

      expect(dbGetSpy).toHaveBeenCalledWith(mockRequest.pathParameters.id)
      expect(dbDeleteSpy).not.toHaveBeenCalled()

      expect(response).toEqual({
        statusCode: 404,
        body: 'User not found'
      })
    })
  })
})
