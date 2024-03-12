// const _mailchimp = require("@mailchimp/mailchimp_marketing");

// _mailchimp.setConfig({
//   apiKey: "6bd1ff3c57c3397fed702068827da703-us8",
//   server: "us8",
// });

// const list_id = "f8b234a1bd";

// class MailchimpMarketing {
//   static async ping() {
//     const response = await _mailchimp.ping.get();
//     console.log(response);
//   }
//   static async getAllLists() {
//     const response = await _mailchimp.lists.getAllLists();
//     console.log(response);
//   }
//   static async getListMembersInfo() {
//     const response = await _mailchimp.lists.getListMembersInfo(list_id);
//     console.log(response);
//   }
//   static async addListMember() {
//     const response = await _mailchimp.lists.addListMember(list_id, {
//       email_address: "1907.khoi@gmail.com",
//       email_type: "html",
//       merge_fields: {
//         FNAME: "khoi",
//         LNAME: "le",
//       },
//       // tags: [tag],
//       status: "subscribed",
//     });
//     console.log(response);
//   }
//   static async deleteListMemberPermanent(member_id) {
//     const response = await _mailchimp.lists.deleteListMemberPermanent(
//       list_id,
//       member_id
//     );
//     console.log(response);
//   }
//   static async sendCampaign(campaignId) {
//     try {
//       await _mailchimp.campaigns.send(campaignId);
//       console.log("send done!");
//     } catch (e) {
//       console.error(e.message);
//     }
//   }
// }

// module.exports = MailchimpMarketing;

// // Mailchimp.addListMember();
// // Mailchimp.getListMembersInfo();
// // Mailchimp.deleteListMemberPermanent();
