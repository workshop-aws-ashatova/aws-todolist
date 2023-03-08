'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { ScanCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = process.env.DYNAMODB_TABLE;
const REGION = process.env.REGION;

const dynamoDbClient = new DynamoDBClient({ region: REGION });

exports.handler = async (event, context) => {
  try {
    // Command to DynamoDB
    const params = {
      TableName: TABLE_NAME
    };
    const command = new ScanCommand(params);
    const data = await dynamoDbClient.send(command);

    // Send Response
    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    };
    return response;
  } catch (ex) {
    // Send Response Error
    console.error(ex);
    const response = {
      statusCode: ex.statusCode || 500,
      body: JSON.stringify({
        message: 'No se pudo obtener los items'
      })
    };
    return response;
  }
};
