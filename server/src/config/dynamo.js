import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

export default dynamoClient;