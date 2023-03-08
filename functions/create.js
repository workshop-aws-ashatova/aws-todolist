'use strict';

const uuid = require('uuid');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = process.env.DYNAMODB_TABLE;
const REGION = process.env.REGION;

const dynamoDbClient = new DynamoDBClient({ region: REGION });

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  try {
    // Validation
    if (typeof body.description !== 'string' || typeof body.done !== 'boolean') {
      throw new HTTPBadRequest('Validation Failed');
    }

    // Command to DynamoDB
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: uuid.v1(),
        description: body.description,
        done: body.done
      }
    };
    const command = new PutCommand(params);
    await dynamoDbClient.send(command);

    // Send Response
    const response = {
      statusCode: 201,
      body: JSON.stringify(params.Item)
    };
    return response;
  } catch (ex) {
    // Send Response Error
    console.error(ex);
    const response = {
      statusCode: ex.statusCode || 500,
      body: JSON.stringify({
        message: ex.error_message || 'No se pudo crear el item'
      })
    };
    return response;
  }
};

class HTTPBadRequest extends Error {
  constructor(args) {
    super(args);
    this.statusCode = 400;
    this.error_message = args;
  }
}
