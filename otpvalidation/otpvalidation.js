// require('dotnev').config()



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceID = process.env.SSID;

function sendsms(phone) {
  const client = require("twilio")(accountSid, authToken);
  client.verify.v2
    .services(serviceID)
    .verifications.create({ to: `+91${phone}`, channel: "sms" })
    .then((verification) => console.log(verification.status));
}

function verifysms(phone,otp) {
  const client = require("twilio")(accountSid, authToken);

  return new Promise((resolve, reject) => {
    client.verify.v2
      .services(serviceID)
      .verificationChecks.create({ to: `+91${phone}`, code: otp })
      .then((verification_check) => {console.log(verification_check.status);
      resolve(verification_check)});
  });
}


module.exports = { sendsms,verifysms};



