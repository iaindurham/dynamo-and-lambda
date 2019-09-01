const database = require('../../src/services/database')
const { update } = require('../../src/handlers/update')
const { update: mockRequest } = require('../mocks/requests.mock')
const mockUsers = require('../mocks/user.mock')

describe('Handlers: update', () => {
  describe('When update is triggered for an existing user with a valid user update object in the request body', () => {
    test('Should add record THEN return 200 response with created record data', async () => {
      const dbUpdateSpy = jest
        .spyOn(database, 'update')
        .mockResolvedValue(mockUsers.retrievedUser)
      const response = await update(mockRequest)

      expect(dbUpdateSpy).toHaveBeenCalledWith(mockRequest.pathParameters.id, {
        firstName: 'Peter'
      })
      expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify(mockUsers.retrievedUser)
      })
    })
  })

  describe('When update is triggered for a user that does NOT exist with a valid user update object in the request body', () => {
    test('Should add record THEN return 404 response', async () => {
      const dbUpdateSpy = jest
        .spyOn(database, 'update')
        .mockRejectedValue(mockUsers.retrievedUser)
      const response = await update(mockRequest)

      expect(dbUpdateSpy).toHaveBeenCalledWith(mockRequest.pathParameters.id, {
        firstName: 'Peter'
      })
      expect(response).toEqual({
        statusCode: 404,
        body: 'User not found'
      })
    })
  })

  describe('When update is triggered with an invalid user update object in the request body', () => {
    test('Should NOT update a record AND return a 400 error', async () => {
      const dbUpdateSpy = jest.spyOn(database, 'update')
      const response = await update({
        ...mockRequest,
        body: JSON.stringify({
          email: 'wrong.format'
        })
      })

      expect(dbUpdateSpy).not.toHaveBeenCalled()
      expect(response).toEqual({
        statusCode: 400,
        body: expect.stringContaining('user data not valid')
      })
    })
  })

  describe('When update is triggered with malformed JSON in the request body', () => {
    test('Should NOT update a record AND return a 400 error', async () => {
      const dbUpdateSpy = jest.spyOn(database, 'update')
      const response = await update({
        ...mockRequest,
        body: '"not: "json'
      })

      expect(dbUpdateSpy).not.toHaveBeenCalled()
      expect(response).toEqual({
        statusCode: 400,
        body: expect.stringContaining('user data not valid')
      })
    })
  })
})
