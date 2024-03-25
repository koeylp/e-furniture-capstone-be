const { MailtrapClient } = require("mailtrap");
const ejs = require("ejs");
const fs = require("fs");
const MailtrapUtil = require("../utils/mailtrapUtils");
const TOKEN = process.env.MAILTRAP_TOKEN;
const filePath = "src/templates/emailTemplate.ejs";
const emailTemplate = fs.readFileSync(filePath, "utf-8");
const client = new MailtrapClient({ token: TOKEN });
const sender = { name: "eFurniture", email: process.env.SENDER_EMAIL };
const compiledTemplate = ejs.compile(emailTemplate);

class MailtrapService {
  static async send(order) {
    try {
      const data = await MailtrapUtil.collectData(order);
      const renderedTemplate = compiledTemplate(data);
      await client.send({
        from: sender,
        to: [{ email: order.order_shipping.email }],
        subject: "Thanks for your order!",
        html: renderedTemplate,
      });
      console.log("Email sent successfully.");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

module.exports = MailtrapService;
