import {
  PutCommand,
  QueryCommand,
  GetCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

import dynamoClient from "../config/dynamo.js";

const TABLE_NAME = "DocuVaultDocuments";

export const createDocument = async (document) => {
  const command = new PutCommand({
    TableName: TABLE_NAME,
    Item: document,
  });

  await dynamoClient.send(command);

  return document;
};

export const getUserDocuments = async (userId) => {
  const command = new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });

  const result = await dynamoClient.send(command);

  return result.Items || [];
};

export const getDocument = async (userId, documentId) => {
  const command = new GetCommand({
    TableName: TABLE_NAME,
    Key: {
      userId,
      documentId,
    },
  });

  const result = await dynamoClient.send(command);

  return result.Item;
};

export const deleteDocument = async (userId, documentId) => {
  const command = new DeleteCommand({
    TableName: TABLE_NAME,
    Key: {
      userId,
      documentId,
    },
  });

  await dynamoClient.send(command);
};

export const updateDocumentStatus = async (userId, documentId, status) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId, documentId },
    UpdateExpression: "SET #status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": status },
    ConditionExpression: "attribute_exists(userId) AND attribute_exists(documentId)",
    ReturnValues: "ALL_NEW",
  });

  const result = await dynamoClient.send(command);
  return result.Attributes;
};

export const updateDocumentFavorite = async (userId, documentId, favorite) => {
  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId, documentId },
    UpdateExpression: "SET favorite = :favorite",
    ExpressionAttributeValues: { ":favorite": favorite },
    ConditionExpression: "attribute_exists(userId) AND attribute_exists(documentId)",
    ReturnValues: "ALL_NEW",
  });

  const result = await dynamoClient.send(command);
  return result.Attributes;
};

export const updateDocument = async (userId, documentId, updates) => {
  const updateExpressions = [];
  const expressionAttributeValues = {};
  const expressionAttributeNames = {};

  Object.entries(updates).forEach(([key, value]) => {
    const safeKey = key === "status" ? "#status" : key === "name" ? "#name" : key;
    updateExpressions.push(`${safeKey} = :${key}`);
    expressionAttributeValues[`:${key}`] = value;
    
    if (safeKey !== key) {
      expressionAttributeNames[safeKey] = key;
    }
  });

  if (updateExpressions.length === 0) {
    throw new Error("No updates provided");
  }

  const command = new UpdateCommand({
    TableName: TABLE_NAME,
    Key: { userId, documentId },
    UpdateExpression: `SET ${updateExpressions.join(", ")}`,
    ExpressionAttributeValues: expressionAttributeValues,
    ...(Object.keys(expressionAttributeNames).length > 0 && {
      ExpressionAttributeNames: expressionAttributeNames,
    }),
    ConditionExpression: "attribute_exists(userId) AND attribute_exists(documentId)",
    ReturnValues: "ALL_NEW",
  });

  const result = await dynamoClient.send(command);
  return result.Attributes;
};