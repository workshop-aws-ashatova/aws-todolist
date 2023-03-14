'use strict';

const db = require('database');
const {
  HTTPError,
  HTTPInternalServerError,
  HTTPNotFoundError
} = require('httpErrors');

const response = {
  statusCode: 204,
  body: ''
};

exports.handler = async (event, context) => {
  console.log('event', event);

  try {
    // Command to DynamoDB
    const result = await db.getTask(event.pathParameters.id);
    if (!result) {
      throw new HTTPNotFoundError('Task not found');
    }

    // Command to DynamoDB
    await db.deleteTask(event.pathParameters.id);

    // Send Response
    response.body = JSON.stringify(result);
    response.statusCode = 204;
    return response;
  } catch (ex) {
    console.error(ex);

    // Send Response Error
    let error = ex instanceof HTTPError ? ex : new HTTPInternalServerError();

    response.body = JSON.stringify(error);
    response.statusCode = error.statusCode;
    return response;
  } finally {
    console.log('respose', response);
  }
};
