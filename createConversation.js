exports.handler = async function(context, event, callback) {
  const numbers = ['YOUR_PHONE_NUMBER', 'YOUR_FRIENDS_PHONE_NUMBER']
  const client = context.getTwilioClient();

  const conversation = await client.conversations.v1.conversations.create();

  await client.serverless.v1.services(context.SERVICE_SID)
    .environments(context.ENVIRONMENT_SID)
    .variables
    .create({key: 'CONVERSATION_SID', value: conversation.sid})

  for (const number of numbers) {
    await client.messages
      .create({
         contentSid: context.CONTENT_SID,
         from: context.MESSAGE_SERVICE_SID,
         to: `whatsapp:${number}`
       })
  }

  return callback(null, conversation.sid);
};
