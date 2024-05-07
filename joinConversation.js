exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  let participant = await client.sync.v1.services(context.TWILIO_SERVICE_SID)
    .syncMaps(context.SYNC_MAP_SID)
    .syncMapItems(event.From)
    .fetch()
    .catch(e => null);

  if (participant && participant.data.name !== event.ProfileName) {
    await client.sync.v1.services(context.TWILIO_SERVICE_SID)
      .syncMaps(context.SYNC_MAP_SID)
      .syncMapItems(event.From)
      .update({ data: { name: event.ProfileName } });
  }
  
  if(!participant && event.Body === 'Join the group chat') {

    await client.conversations.v1.conversations(context.CONVERSATION_SID).participants.create({
      'messagingBinding.address': event.From,
      'messagingBinding.proxyAddress': `whatsapp:${context.WHATSAPP_NUMBER}`
    }).catch(e => null)

    await client.sync.v1.services(context.TWILIO_SERVICE_SID)
    .syncMaps(context.SYNC_MAP_SID)
    .syncMapItems
    .create({ key: event.From, data: { name: event.ProfileName } });

    await client.conversations.v1.conversations(context.CONVERSATION_SID)
                       .messages
                       .create({author: 'system', body: `${event.ProfileName} joined the group`})
  }

  return callback(null);
};
