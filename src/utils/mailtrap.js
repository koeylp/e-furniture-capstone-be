const { MailtrapClient } = require("mailtrap");

const TOKEN = "734e41e6cbd2420ad1c021541481c0f4";
const SENDER_EMAIL = "khoiltse160615@fpt.edu.vn";
const RECIPIENT_EMAIL = "khoiltse160615@fpt.edu.vn";

const client = new MailtrapClient({ token: TOKEN });

const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };

client
  .send({
    from: sender,
    to: [{ email: RECIPIENT_EMAIL }],
    subject: "Hello from Mailtrap!",
    text: "Welcome to Mailtrap Sending!",
  })
  .then(console.log)
  .catch(console.error);
