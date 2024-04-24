import { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent): Promise<SQSEvent> => {
  console.log(JSON.stringify(event, null, 2));
  throw new Error("This is an error");
}