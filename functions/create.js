'use strict';

const { generateUUID } = require('helpers');
const db = require('database');
const {
  HTTPError,
  HTTPInternalServerError,
  HTTPBadRequestError
} = require('httpErrors');

const response = {
  statusCode: 201,
  body: ''
};

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  try {
    // Validation
    ValidateFields(body);

    // Command to DynamoDB
    const newItem = {
      id: generateUUID(),
      description: body.description,
      done: body.done
    };

    await db.createTask(newItem);

    // Send Response
    response.body = JSON.stringify(newItem);
    response.statusCode = 201;
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
  if (!body.hasOwnProperty('description')) {
    throw new HTTPBadRequestError("'description' field is required");
  } else if (typeof body.description !== 'string') {
    throw new HTTPBadRequestError("'description' field is a string");
  }

  if (!body.hasOwnProperty('done')) {
    throw new HTTPBadRequestError("'done' field is required");
  } else if (typeof body.done !== 'boolean') {
    throw new HTTPBadRequestError("'done' field is a boolean");
  }
};
