class SocketIOService {
  connection(socket) {
    socket.on("notification", () => {});
    socket.on("add-user", (account_id) => {
      onlineUsers.set(account_id, socket.id);
      _io.to(socket.id).emit("checkRegister", "Toàn Was Here");
    });

    socket.on("login-user", (account_id) => {
      if (global.onlineUsers.has(account_id)) {
        const user = global.onlineUsers.get(account_id);
        _io.to(socket.id).emit("checkLogin", "Đã Có Tài Khoản");
      } else {
        _io.to(socket.id).emit("checkLogin", "Đéo Có Tài Khoản");
      }
      global.onlineUsers.set(account_id, socket.id);
    });

    socket.emit("hello", "world");
  }
  sendNotifiToDelivery(account_id, state) {
    const user = onlineUsers.get(account_id);
    if (user) {
      _io.to(user).emit("send-noti-to-delivery", state);
    }
  }
}
module.exports = new SocketIOService();
