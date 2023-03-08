'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');


const TABLE_NAME = process.env.DYNAMODB_TABLE;
const REGION = process.env.REGION;

const dynamoDbClient = new DynamoDBClient({ region: REGION });

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  try {
    // Validation
    if (body.description && typeof body.description !== 'string') {
      throw new HTTPBadRequest('Validation Failed');
    }
    if (body.done && typeof body.done !== 'boolean') {
      throw new HTTPBadRequest('Validation Failed');
    }

    // Command to DynamoDB
    const paramsGet = {
      TableName: TABLE_NAME,
      Key: {
        id: event.pathParameters.id
      }
    };
    const commandGet = new GetCommand(paramsGet);
    const objetito = await dynamoDbClient.send(commandGet);
    
    // Command to DynamoDB
    const paramsUpdate = {
      TableName: TABLE_NAME,
      Key: {
        id: event.pathParameters.id
      },
      ExpressionAttributeValues: {
        ':description': body.description !== undefined ? body.description : objetito.Item.description,
        ':done': body.done !== undefined ? body.done : objetito.Item.done
      },
      UpdateExpression: 'SET description = :description, done = :done',
      ReturnValues: 'ALL_NEW'
    };
    
    const commandUpdate = new UpdateCommand(paramsUpdate);
    const data = await dynamoDbClient.send(commandUpdate);

    // Send Response
    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Attributes)
    };
    return response;
  } catch (ex) {
    // Send Response Error
    console.error(ex);
    const response = {
      statusCode: ex.statusCode || 500,
      body: JSON.stringify({
        message: ex.error_message || 'No se pudo actualizar el item'
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