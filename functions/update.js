'use strict';

const db = require('database');
const {
  HTTPError,
  HTTPInternalServerError,
  HTTPBadRequestError,
  HTTPNotFoundError
} = require('httpErrors');

const response = {
  statusCode: 200,
  body: ''
};

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  try {
    // Validation
    ValidateFields(body);

    // Command to DynamoDB
    const dataTask = await db.getTask(event.pathParameters.id);
    if (!dataTask) {
      throw new HTTPNotFoundError('Task not found');
    }

    // Command to DynamoDB
    const newItem = {
      description:
        body.description !== undefined ? body.description : dataTask.description,
      done: body.done !== undefined ? body.done : dataTask.done
    };
    const result = await db.updateTask(event.pathParameters.id, newItem);

    // Send Response
    response.body = JSON.stringify(result);
    response.statusCode = 200;
    return response;
  } catch (ex) {
    console.error(ex);

    // Send Response Error
    let error = ex instanceof HTTPError ? ex : new HTTPInternalServerError();

    response.body = JSON.stringify(error);
    response.statusCode = error.statusCode;
    return response;
  }
};

const ValidateFields = (body) => {
  if (body.hasOwnProperty('description') && typeof body.description !== 'string') {
    throw new HTTPBadRequestError("'description' field is a string");
  }

  if (body.hasOwnProperty('done') && typeof body.done !== 'boolean') {
    throw new HTTPBadRequestError("'done' field is a boolean");
  }
};
