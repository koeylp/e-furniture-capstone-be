const _mailchimpTx = require("@mailchimp/mailchimp_transactional")(
  "md-16bLYUx-FN740s7f7SzR6w"
);

const message = {
  from_email: "khoiltse160615@fpt.edu.vn",
  subject: "Hello world",
  text: "Welcome to Mailchimp Transactional!",
  to: [
    {
      email: "lethekhoi1919@gmail.com",
      type: "to",
    },
  ],
};

class MailchimpTransactional {
  static async ping() {
    const response = await _mailchimpTx.users.ping();
    console.log(response);
  }
  static async send() {
    const response = await _mailchimpTx.messages.send({
      message,
    });
    console.log(response);
  }
}

module.exports = MailchimpTransactional;
MailchimpTransactional.send();
