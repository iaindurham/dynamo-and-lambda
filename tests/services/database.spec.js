const AWS = require('aws-sdk-mock')
const database = require('../../src/services/database')
const userMocks = require('../mocks/user.mock')

const mockTableName = 'tests-table'

beforeEach(() => {
  process.env.DYNAMODB_TABLE = mockTableName
})

describe('Services: database', () => {
  afterEach(() => {
    database.resetClient()
    AWS.restore('DynamoDB.DocumentClient')
  })

  describe('get', () => {
    const idToGet = 'id-to-search-for'
    let mockGet

    beforeEach(() => {
      mockGet = jest.fn()
      AWS.mock('DynamoDB.DocumentClient', 'get', mockGet)
    })

    test('Should return the record without credentials WHEN id DOES match a record', async () => {
      mockGet.mockResolvedValue({
        Item: userMocks.createdUser
      })

      const result = await database.get(idToGet)

      expect(mockGet).toHaveBeenCalledWith(
        expect.objectContaining({
          TableName: mockTableName,
          Key: {
            id: idToGet
          }
        }),
        expect.any(Function)
      )

      expect(result).toEqual(userMocks.retrievedUser)
    })

    test(`Should return the record with credentials WHEN id DOES match a record
    AND the "includeCredentials" option is passed in`, async () => {
      mockGet.mockResolvedValue({
        Item: userMocks.createdUser
      })

      const result = await database.get(idToGet, { includeCredentials: true })

      expect(mockGet).toHaveBeenCalledWith(
        expect.objectContaining({
          TableName: mockTableName,
          Key: {
            id: idToGet
          }
        }),
        expect.any(Function)
      )

      expect(result).toEqual(userMocks.createdUser)
    })

    test('Should return `null` WHEN id DOESN`T match any records', async () => {
      mockGet.mockResolvedValue({})

      const result = await database.get(idToGet)

      expect(mockGet).toHaveBeenCalledWith(
        expect.objectContaining({
          TableName: mockTableName,
          Key: {
            id: idToGet
          }
        }),
        expect.any(Function)
      )

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    test(`Should create a new record in Dynamo using record data passed in
    AND return the users data`, async () => {
      const mockPut = jest.fn().mockResolvedValue()
      AWS.mock('DynamoDB.DocumentClient', 'put', mockPut)

      const result = await database.create({
        ...userMocks.newUser
      })

      expect(mockPut).toHaveBeenCalledWith(
        expect.objectContaining({
          TableName: mockTableName,
          Item: expect.objectContaining({
            ...userMocks.createdUser,
            id: expect.any(String)
          })
        }),
        expect.any(Function)
      )

      expect(result).toEqual(userMocks.retrievedUser)
    })
  })

  describe('update', () => {
    const mockId = '2343-23-23-2-23'

    describe('When updating a user that exists', () => {
      test(`Should update the record in Dynamo using record data passed in 
    AND return the updated users data`, async () => {
        const mockGet = jest.fn().mockResolvedValue({
          Item: userMocks.createdUser
        })
        const mockPut = jest.fn().mockResolvedValue()
        AWS.mock('DynamoDB.DocumentClient', 'get', mockGet)
        AWS.mock('DynamoDB.DocumentClient', 'put', mockPut)

        const result = await database.update(mockId, {
          ...userMocks.createdUser,
          firstName: 'Mick'
        })

        expect(mockGet).toHaveBeenCalledWith(
          expect.objectContaining({
            TableName: mockTableName,
            Key: {
              id: mockId
            }
          }),
          expect.any(Function)
        )
        expect(mockPut).toHaveBeenCalledWith(
          expect.objectContaining({
            TableName: mockTableName,
            Item: expect.objectContaining({
              ...userMocks.createdUser,
              firstName: 'Mick'
            })
          }),
          expect.any(Function)
        )

        expect(result).toEqual({
          ...userMocks.retrievedUser,
          firstName: 'Mick'
        })
      })
    })

    describe('When updating a user that does NOT exist', () => {
      test('Should throw and error AND NOT update the record in Dynamo', async () => {
        const mockGet = jest.fn().mockResolvedValue(null)
        const mockPut = jest.fn().mockResolvedValue()
        AWS.mock('DynamoDB.DocumentClient', 'get', mockGet)
        AWS.mock('DynamoDB.DocumentClient', 'put', mockPut)

        await expect(
          database.update(mockId, {
            ...userMocks.createdUser,
            firstName: 'Mick'
          })
        ).rejects.toThrow()

        expect(mockGet).toHaveBeenCalledWith(
          expect.objectContaining({
            TableName: mockTableName,
            Key: {
              id: mockId
            }
          }),
          expect.any(Function)
        )
        expect(mockPut).not.toHaveBeenCalled()
      })
    })
  })

  describe('del', () => {
    test('Should delete the record from Dynamo for the id passed in', async () => {
      const mockDelete = jest.fn().mockResolvedValue()
      AWS.mock('DynamoDB.DocumentClient', 'delete', mockDelete)

      const idToDelete = 'id-to-delete'
      await database.del(idToDelete)

      expect(mockDelete).toHaveBeenCalledWith(
        expect.objectContaining({
          TableName: mockTableName,
          Key: {
            id: idToDelete
          }
        }),
        expect.any(Function)
      )
    })
  })
})
