const crypto = require("crypto");
async function getCode(id, variation) {
  const values = [];
  variation.forEach((obj) => {
    values.push(obj.property_id);
  });
  let varationValue = values.join("");
  const code = crypto
    .createHash("sha256")
    .update(id + varationValue)
    .digest("hex")
    .slice(0, 20);
  return code;
}
async function getCodeByOneProperty(id, property_id) {
  const code = crypto
    .createHash("sha256")
    .update(id + property_id)
    .digest("hex")
    .slice(0, 20);
  return code;
}
module.exports = {
  getCode,
  getCodeByOneProperty,
};
