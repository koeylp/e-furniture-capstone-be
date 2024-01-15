const node_openssl = require("node-openssl-cert");
const openssl = new node_openssl();
const fs = require("fs");

const generatePrivateKey = () => {
  openssl.generateRSAPrivateKey({}, function (err, key, cmd) {
    fs.writeFile("private.key", key, (err) => {
        if (err) {
            console.log(err);
        }
    })
  });
};

module.exports = { generatePrivateKey };
