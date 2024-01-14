// config/server.js

const { connectToDatabase } = require("./src/databases/initMongodb");

const startServer = async (app) => {
  try {
    await connectToDatabase();
    const PORT = process.env.PORT || 4646;
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
  } catch (error) {
    console.log(`${error} did not connect`);
  }
};

module.exports = { startServer };
