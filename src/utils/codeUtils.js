const { verifyProductExistence } = require("./verifyExistence");
const crypto = require("crypto");
async function getCode(id, variation) {
  const values = [];
  await verifyProductExistence(id);
  variation.forEach((obj) => {
    values.push(obj._id);
  });
  let varationValue = values.join("");
  const code = crypto
    .createHash("sha256")
    .update(id + varationValue)
    .digest("hex")
    .slice(0, 20);
  return code;
}
module.exports = {
  getCode,
};
