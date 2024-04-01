class SocketIOService {
  connection(socket) {
    socket.on("notification", () => {});
    socket.on("check", (msg) => {
      _io.emit("check", msg);
    });
    socket.emit("hello", "world");
  }
}
module.exports = new SocketIOService();
