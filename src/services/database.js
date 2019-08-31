const AWS = require('aws-sdk')

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

  return createdClient
}

const client = () => createdClient || createClient()

// This is needed for the tests to allow for the AWS.DynamoDB.DocumentClient to be mocked
function resetClient() {
  createdClient = null
}

const get = async ({ tableName, id }) => {
  const params = {
    TableName: tableName,
    Key: {
      id
    }
  }
  const result = await client()
    .get(params)
    .promise()

  return result.Item || null
}

const scan = async ({ tableName }) => {
  const params = {
    TableName: tableName
  }

  const results = await client()
    .scan(params)
    .promise()

  return results.Items
}

const put = async ({ tableName, record }) => {
  const params = {
    TableName: tableName,
    Item: record
  }

  await client()
    .put(params)
    .promise()

  return record
}

// Can't call this method `delete` as it is a reserved word
const del = async ({ tableName, id }) => {
  const params = {
    TableName: tableName,
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
  scan,
  del,
  put
}
