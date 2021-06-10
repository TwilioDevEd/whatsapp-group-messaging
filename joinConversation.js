exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  let participant = await client.sync.services(process.env.TWILIO_SERVICE_SID)
    .syncMaps(process.env.SYNC_MAP_SID)
    .syncMapItems(event.From)
    .fetch()
    .catch(e => null);

  if (!participant) {
    subscriber = await client.sync.services(process.env.TWILIO_SERVICE_SID)
      .syncMaps(process.env.SYNC_MAP_SID)
      .syncMapItems
      .create({ key: event.From, data: { name: event.ProfileName } });
  } else if (participant.data.name !== event.ProfileName) {
    subscriber = await client.sync.services(process.env.TWILIO_SERVICE_SID)
      .syncMaps(process.env.SYNC_MAP_SID)
      .syncMapItems(event.From)
      .update({ data: { name: event.ProfileName } });
  }

  if(event.Body === 'Join the group chat') {
    let twiml = new Twilio.twiml.MessagingResponse();
    twiml.message(`Welcome to the conversation, ${event.ProfileName}!`);

    return callback(null, twiml);
  }

  return callback(null);
};
