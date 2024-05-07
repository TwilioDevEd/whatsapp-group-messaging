# whatsapp-group-messaging

With Twilio's [Conversations API](https://www.twilio.com/docs/conversations/using-whatsapp-conversations), you can implement group chats in WhatsApp, a feature which is not offered natively in WhatsApp's API. With this code sample, you can implement multi-participant chat for up to 50 people that users can opt into and communicate through a single Twilio WhatsApp sender (business profile).
## Prerequisites
Before moving forward, you are going to need the following, which may take some time to be approved if you don't already have them:
- A WhatsApp Business Profile - [you can request access here](https://www.twilio.com/whatsapp/request-access)
- A WhatsApp Sender for your Business Profile - [request access here](https://www.twilio.com/console/sms/whatsapp/senders)
- A WhatsApp [Content Template](https://www.twilio.com/docs/content/send-templates-created-with-the-content-template-builder#send-messages-with-a-messaging-service-in-the-from-field) for initiating the conversation - [create a Quick reply template here](https://console.twilio.com/us1/develop/sms/content-template-builder/template/create).
You will have to wait for these to be approved before you are able to write code for WhatsApp with the Conversations API.

Once that's taken care of, you can begin setting up your project. These code samples are all built to run within the Twilio Ecosystem using [Twilio Functions](https://www.twilio.com/docs/runtime/functions) and [Twilio Sync](https://www.twilio.com/docs/sync).
## Configuration
### Creating the Functions
Create a [Twilio Functions Service](https://www.twilio.com/console/functions/overview/services), and then add three functions, one for each `.js` file in the `Functions` folder of this repository. Make sure the privacy for the Function corresponding to `createConversation.js` is set to "Public", and the other two are "Protected".

### Replacing placeholder code for phone numbers
After copying/pasting the code for these Functions, you are going to want to change the values inside the `numbers` array to the WhatsApp numbers of the users you want to add to the Conversation. As these code samples are a proof of concept to get you up and running, the values for your users' phone numbers are going to be hard-coded for now. You can change this to fit your needs depending on where your users' phone numbers are stored.

### Adding your WhatsApp Sender to a Messaging Service
Under [Messaging Services](https://www.twilio.com/console/sms/services) in your Twilio Console, add your WhatsApp number as a Sender to one of your Messaging Services.

### Webhooks
On the page for your Messaging Service, click "Integration" and select "Send a webhook". Enter the URL for your Twilio Function corresponding to `joinConversation.js` and hit "Save". 

Now in your [Conversations configuration](https://www.twilio.com/console/conversations/configuration/webhooks), set your Pre-Event webhook to the url corresponding to `message.js`, and in the Pre-webhooks section, select `onMessageAdd`.

### Setting up Twilio Sync
First you'll need to create a [Sync Service](https://www.twilio.com/docs/sync/api/service), which can be done with the following command using the [Twilio CLI](https://twil.io/cli):
```shell
twilio api:sync:v1:services:create
```
Or with the following Node.js code using the Twilio helper library:
```JavaScript
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.sync.v1.services.create().then(service => console.log(service.sid));
```
Make sure you save this SID to be used as an environment variable.

Next, create a [Sync Map](https://www.twilio.com/docs/sync/api/map-resource) with the following Twilio CLI command:
```shell
twilio api:sync:v1:services:maps:create \
   --service-sid ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```
Or with the following Node.js code:
```JavaScript
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

client.sync.v1.services('ISXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX')
         .syncMaps
         .create()
         .then(sync_map => console.log(sync_map.sid));
```
Save this SID as well to be used as an environment variable.

### Environment Variables
Make sure the environment variables in your Functions Service are set correctly:</br>
`SYNC_MAP_SID` - SID for the Sync Map you created.</br>
`TWILIO_SERVICE_SID` - SID for your Twilio Sync Service.</br>
`WHATSAPP_NUMBER` - Phone number for your WhatsApp Sender.</br>
`MESSAGE_SERVICE_SID` - SID of your Messaging Service.</br>
`CONTENT_SID` - SID of your Content Template.

## Running the Code
When you are finally ready to run the code and initiate WhatsApp group messaging, copy the URL for your Function for `createConversation.js` and visit it in your web browser to run the code. It should start a Conversation, add each of the phone numbers you entered as participants in the Conversation, and send an initial message to each of them of the template that you created. 

My message, for example, sent a button that the user could click to respond with "Join the conversation", which would then trigger the Function for `message.js`.

You should now have a WhatsApp group chat using the Twilio Conversations API.
