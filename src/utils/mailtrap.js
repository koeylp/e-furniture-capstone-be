const { MailtrapClient } = require("mailtrap");

const TOKEN = "4ddd80a13ad89cc71116388587f0c656";
const SENDER_EMAIL = "no-reply@efurniturenotification.live";
const RECIPIENT_EMAIL = "lethekhoi1919@gmail.com";

const client = new MailtrapClient({ token: TOKEN });

const sender = { name: "eFutniture", email: SENDER_EMAIL };
class Mailtrap {
  static async send() {
    await client
      .send({
        from: sender,
        to: [{ email: RECIPIENT_EMAIL }],
        subject: "Order Confirmation!",
        text: "Welcome to Mailtrap Sending!",
      })
      .then(console.log)
      .catch(console.error);
  }
}

module.exports = Mailtrap;
