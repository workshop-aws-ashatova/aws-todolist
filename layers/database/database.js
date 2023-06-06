'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  ScanCommand, //List elements
  GetCommand, //Gets an element by key
  UpdateCommand, //Updates an element by key
  PutCommand, //Creates an element (also updates if exists but is not used here)
  DeleteCommand //Deletes an element by key
} = require('@aws-sdk/lib-dynamodb');

const REGION = process.env.REGION;
const TABLE_NAME = process.env.DYNAMODB_TABLE_TASKS;

const dynamoDbClient = new DynamoDBClient({ region: REGION });

exports.listTasks = async () => {
  console.log('In listTask');

  const params = {
    TableName: TABLE_NAME
  };
  const command = new ScanCommand(params);
  const result = await dynamoDbClient.send(command);

  return result.Items;
};

exports.getTask = async (id) => {
  console.log('In getTask');

  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id
    }
  };
  const command = new GetCommand(params);
  const result = await dynamoDbClient.send(command);

  return result.Item;
};

exports.createTask = async ({ id, description, done }) => {
  console.log('In createTask');

  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: id,
      description: description || '',
      done: done || false
    }
  };
  const command = new PutCommand(params);
  await dynamoDbClient.send(command);
};

exports.updateTask = async (id, { description, done }) => {
  console.log('In updateTask');

  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id
    },
    ExpressionAttributeValues: {
      ':description': description,
      ':done': done
    },
    UpdateExpression: 'SET description = :description, done = :done',
    ReturnValues: 'ALL_NEW'
  };

  const command = new UpdateCommand(params);
  const result = await dynamoDbClient.send(command);

  return result.Attributes;
};

exports.deleteTask = async (id) => {
  console.log('In deleteTask');

  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: id
    }
  };
  const command = new DeleteCommand(params);
  await dynamoDbClient.send(command);
};
