const AWS = require('aws-sdk')
const uuid = require('uuid').v4
const stripCredentials = require('../utils/stripCredentials')

let createdClient

const createClient = () => {
  console.log('creating client: process.env.IS_OFFLINE', process.env.IS_OFFLINE)

  // Note: The document client needs to be created in a method so that it can be mocked in the tests
  createdClient = process.env.IS_OFFLINE
    ? new AWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    : new AWS.DynamoDB.DocumentClient({ convertEmptyValues: true })
  // createdClient = dynamodb.doc

  return createdClient
}

const client = () => createdClient || createClient()
const tableName = () => process.env.DYNAMODB_TABLE

// This is needed for the tests to allow for the AWS.DynamoDB.DocumentClient to be mocked
function resetClient() {
  createdClient = null
}

const get = async (id, { raw = false } = {}) => {
  const params = {
    TableName: tableName(),
    Key: {
      id
    }
  }
  const result = await client()
    .get(params)
    .promise()

  if (result.Item) {
    return raw ? result.Item : stripCredentials(result.Item)
  }

  return null
}

const put = async record => {
  const params = {
    TableName: tableName(),
    Item: record
  }

  await client()
    .put(params)
    .promise()

  return stripCredentials(record)
}

const create = async record => {
  const newRecord = {
    id: uuid(),
    ...record
  }

  await put(newRecord)

  return stripCredentials(newRecord)
}

const update = async (id, updatedData) => {
  const user = await get(id, { raw: true })

  if (!user) {
    throw new Error('404')
  }

  const mergedUserData = {
    ...user,
    ...updatedData
  }

  // Note: This updates by overwriting the whole record
  await put(mergedUserData)

  return stripCredentials(mergedUserData)
}

// Can't call this method `delete` as it is a reserved word
const del = async id => {
  const params = {
    TableName: tableName(),
    Key: {
      id
    }
  }

  return client()
    .delete(params)
    .promise()
}

module.exports = {
  resetClient,
  get,
  create,
  update,
  del
}
