// config/server.js
const { connectToDatabase } = require("./src/databases/initMongodb");
const io = require("socket.io");
const { Server } = require("socket.io");
const SocketIOService = require("./src/services/socketIOService");

global._io = io;
global.onlineUsers = new Map();

const startServer = async (app) => {
  try {
    await connectToDatabase();
    const PORT = process.env.PORT || 4646;
    const server = app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    const io = new Server(server, {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:5173",
          "https://emate-user.vercel.app",
          "https://emate-admin.vercel.app",
          "https://efurniture-admin.vercel.app",
        ],
        credentials: true,
      },
      allowEIO3: true,
    });
    global._io = io.on("connection", SocketIOService.connection);
  } catch (error) {
    console.log(`${error} did not connect`);
  }
};

module.exports = { startServer };
