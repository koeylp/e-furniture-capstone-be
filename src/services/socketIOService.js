class SocketIOService {
  connection(socket) {
    socket.on("notification", () => {});
    socket.on("check", (msg) => {
      _io.emit("check", msg);
    });
    socket.emit("hello", "world");
    socket.emit("hello123", "Tui tên Toàn nè Hello mọi người");
  }
}
module.exports = new SocketIOService();
