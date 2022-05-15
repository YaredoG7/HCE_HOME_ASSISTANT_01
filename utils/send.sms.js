const accountSid = 'ACd20450fd0f4274df4a31eb15f938924a';
const authToken = '9448fa5915ab8917423c2b2cd7b533f4';
const clinet = require('twilio')(accountSid, authToken);

function sendMessage (message) {

clinet.messages.create({
    body: message.body,
    from: '+447458156112',
    to:  message.to
}).then(message => {
    // console.log(message);
    return message;
}, err => {
    console.log(err);
    return false;
});
}

module.exports = sendMessage;
