const AWS = require('aws-sdk-mock')
const database = require('../../src/services/database')
const recordMock = require('../mocks/user.mock')

const mockTableName = 'tests-table'

describe('Services: database', () => {
  const mockRecords = [recordMock, { ...recordMock, id: '234234-2425456' }]

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

    test('Should return the record WHEN id DOES match a record', async () => {
      mockGet.mockResolvedValue({
        Item: recordMock
      })

      const result = await database.get({
        tableName: mockTableName,
        id: idToGet
      })

      expect(mockGet).toBeCalledWith(
        expect.objectContaining({
          TableName: mockTableName,
          Key: {
            id: idToGet
          }
        }),
        expect.any(Function)
      )

      expect(result).toEqual(recordMock)
    })

    test('Should return `null` WHEN id DOESN`T match any records', async () => {
      mockGet.mockResolvedValue({})

      const result = await database.get({
        tableName: mockTableName,
        id: idToGet
      })

      expect(mockGet).toBeCalledWith(
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

  describe('scan', () => {
    test('Should return an array containing all the records in the DB', async () => {
      const mockScan = jest.fn().mockResolvedValue({ Items: mockRecords })
      AWS.mock('DynamoDB.DocumentClient', 'scan', mockScan)

      const results = await database.scan({ tableName: mockTableName })

      expect(mockScan).toBeCalledWith(
        expect.objectContaining({
          TableName: mockTableName
        }),
        expect.any(Function)
      )

      expect(results).toEqual(mockRecords)
    })
  })

  describe('put', () => {
    test('Should create a new record in Dynamo using record data passed in', async () => {
      const mockPut = jest.fn().mockResolvedValue()
      AWS.mock('DynamoDB.DocumentClient', 'put', mockPut)

      await database.put({
        tableName: mockTableName,
        record: {
          ...recordMock
        }
      })

      expect(mockPut).toBeCalledWith(
        expect.objectContaining({
          TableName: mockTableName,
          Item: {
            ...recordMock
          }
        }),
        expect.any(Function)
      )
    })
  })

  describe('delete', () => {
    test('Should delete the record from Dynamo for the id passed in', async () => {
      const mockDelete = jest.fn().mockResolvedValue()
      AWS.mock('DynamoDB.DocumentClient', 'delete', mockDelete)

      const idToDelete = 'id-to-delete'
      await database.del({
        tableName: mockTableName,
        id: idToDelete
      })

      expect(mockDelete).toBeCalledWith(
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
