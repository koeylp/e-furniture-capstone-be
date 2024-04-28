class SocketIOService {
  static onlineUsers = {};
  connection(socket) {
    socket.on("notification", () => {});
    socket.on("add-user", (account_id) => {
      onlineUsers.set(account_id, socket.id);
      _io.to(socket.id).emit("checkRegister", "Toàn Was Here");
    });

    socket.on("login-user", (account_id) => {
      if (SocketIOService.onlineUsers[account_id]) {
        const user = SocketIOService.onlineUsers[account_id];
        if (user !== socket.id) {
          _io.to(user).emit("checkLogin", {
            message: `Tài khoản bị đăng nhập ở nơi khác ${user}`,
            account_id: account_id,
            socketId: user,
            listUser: SocketIOService.onlineUsers,
          });
          delete SocketIOService.onlineUsers[account_id];
        }
      }
      SocketIOService.onlineUsers[account_id] = socket.id;
      console.log(SocketIOService.onlineUsers);
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
