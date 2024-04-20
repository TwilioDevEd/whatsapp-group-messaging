exports.handler = async function(context, event, callback) {
  const client = context.getTwilioClient();

  let participant = await client.sync.v1.services(context.TWILIO_SERVICE_SID)
    .syncMaps(context.SYNC_MAP_SID)
    .syncMapItems(event.Author)
    .fetch()
    .catch(e => null);

  const modifiedBody = `*${participant.data.name}*: ${event.Body}`;

  return callback(null, { 'body': modifiedBody });
};