exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  let participant = await client.sync.services(process.env.TWILIO_SERVICE_SID)
    .syncMaps(process.env.SYNC_MAP_SID)
    .syncMapItems(event.Author)
    .fetch()
    .catch(e => null);

  const modifiedBody = `${participant.data.name}: ${event.Body}`;

  return callback(null, { 'body': modifiedBody });
};
