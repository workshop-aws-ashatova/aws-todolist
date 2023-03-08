'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { GetCommand } = require('@aws-sdk/lib-dynamodb');

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
    const command = new GetCommand(params);
    const data = await dynamoDbClient.send(command);

    // Send Response
    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Item)
    };
    return response;
  } catch (ex) {
    // Send Response Error
    console.error(ex);
    const response = {
      statusCode: ex.statusCode || 500,
      body: JSON.stringify({
        message: 'No se pudo obtener el item'
      })
    };
    return response;
  }
};
