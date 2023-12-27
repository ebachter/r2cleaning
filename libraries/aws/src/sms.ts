//app.js

import {SNSClient, PublishCommand} from '@aws-sdk/client-sns'; //npm install aws-sdk

export const snsClient = new SNSClient({});

export const sendSMS = async (
  message = 'Hello from SNS!',
  phoneNumber = '+491633649875',
) => {
  try {
    const response = await snsClient.send(
      new PublishCommand({
        Message: message,
        // One of PhoneNumber, TopicArn, or TargetArn must be specified.
        PhoneNumber: phoneNumber,
      }),
    );
    console.log(response);
    // {
    //   '$metadata': {
    //     httpStatusCode: 200,
    //     requestId: '7410094f-efc7-5f52-af03-54737569ab77',
    //     extendedRequestId: undefined,
    //     cfId: undefined,
    //     attempts: 1,
    //     totalRetryDelay: 0
    //   },
    //   MessageId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    // }
    return response;
  } catch (e) {
    console.log('sns', e);
  }
};
