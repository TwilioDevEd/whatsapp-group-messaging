exports.handler = async function(context, event, callback) {
  const numbers = ['YOUR_PHONE_NUMBER', 'YOUR_FRIENDS_PHONE_NUMBER']
  const client = context.getTwilioClient();

  const conversation = await client.conversations.conversations.create();

  numbers.forEach(async (number) => {

    const newParticipant = await client.conversations.conversations(conversation.sid).participants.create({
      'messagingBinding.address': `whatsapp:${number}`,
      'messagingBinding.proxyAddress': `whatsapp:${process.env.WHATSAPP_NUMBER}`
    });

    const message = await client.messages.create({
      'to': `whatsapp:${number}`,
      'from': `whatsapp:${process.env.WHATSAPP_NUMBER}`,
      'body': ' Sam has invited you to join a group conversation. *Please tap the button below to confirm your participation.*'
    });
  });

  return callback(null, conversation.sid);
};
