class SocketIOService {
  connection(socket) {
    socket.on("notification", () => {});
    socket.on("add-user", (account_id) => {
      onlineUsers.set(account_id, socket.id);
    });

    socket.emit("hello", "world");
  }
  sendNotifiToDelivery(account_id) {
    const user = onlineUsers.get(account_id);
    console.log(user);
    if (user) {
      _io.to(user).emit("send-noti-to-delivery", true);
    }
  }
}
module.exports = new SocketIOService();
