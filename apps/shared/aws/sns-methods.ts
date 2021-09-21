import '../../../config/aws.config'

import * as AWS from 'aws-sdk';

const sns = new AWS.SNS({ apiVersion: '2010-03-31' });

export const publishSNS = (message: string, topicArn: string, messageAttributes?) => {
  const params = {
    Message: message, /* required */
    MessageAttributes: messageAttributes,
    TopicArn: topicArn
  };

  sns.publish(params, function (err, data) {
    if (err) console.log('Erro SNS publish', err, err.stack); // an error occurred
    else console.log('SNS OK! - Publish', data);           // successful response
  });
}

export const confirmSNS = (topicArn: string, token: string) => {
  // Request options
  let options = {
    TopicArn: topicArn,
    Token : token
  }
  // Confirm Token Subscription
  sns.confirmSubscription(options, function (err, data) {
    if (err) console.error('Error SNS Confirmed', err, err.stack); // an error occurred
    else console.info('SNS OK! - Confirmed', data);           // successful response
  });
}