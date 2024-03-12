const _mailchimpTx = require("@mailchimp/mailchimp_transactional")(
  "md-16bLYUx-FN740s7f7SzR6w"
);

class MailchimpTransactional {
  static async ping() {
    const response = await _mailchimpTx.users.ping();
    console.log(response);
  }
}

module.exports = MailchimpTransactional;

