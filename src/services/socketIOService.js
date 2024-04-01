class SocketIOService {
  connection(socket) {
    socket.on("notification", () => {});
    socket.on("check", (msg) => {
      _io.emit("check", msg);
    });
  }
}
module.exports = new SocketIOService();
