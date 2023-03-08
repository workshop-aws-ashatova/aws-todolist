'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = process.env.DYNAMODB_TABLE;
const REGION = process.env.REGION;

const dynamoDbClient = new DynamoDBClient({ region: REGION });

exports.handler = async (event, context) => {
  try {
    // Command to DynamoDB
    const params = {
      TableName: TABLE_NAME,
      Key: {
        id: event.pathParameters.id
      }
    };
    const command = new DeleteCommand(params);
    await dynamoDbClient.send(command);

    // Send Response
    const response = {
      statusCode: 204,
      body: JSON.stringify({})
    };
    return response;
  } catch (ex) {
    // Send Response Error
    console.error(ex);
    const response = {
      statusCode: ex.statusCode || 500,
      body: JSON.stringify({
        message: 'No se pudo eliminar el item'
      })
    };
    return response;
  }
};
