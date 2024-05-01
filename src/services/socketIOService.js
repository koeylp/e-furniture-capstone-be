class SocketIOService {
  static onlineUsers = {};
  static onlineDelivery = {};
  connection(socket) {
    socket.on("notification", () => {});
    socket.on("add-user", (account_id) => {
      SocketIOService.onlineDelivery[account_id] = socket.id;
      const user = SocketIOService.onlineDelivery[account_id];
      _io
        .to(user)
        .emit(
          "checkRegister",
          `Toàn Was Here ${SocketIOService.onlineDelivery}`
        );
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
    });

    socket.emit("hello", "world");
  }
  sendNotifiToDelivery(account_id, state) {
    const user = SocketIOService.onlineDelivery[account_id];
    console.log("Here", user);
    _io.emit("hello", { user: user, name: "Fuck", state: state });
    if (user) {
      _io.to(user).emit("send-noti-to-delivery", {
        message: `New Message Here`,
        account_id: account_id,
        socketId: user,
        state: state,
      });
    }
  }
}
module.exports = new SocketIOService();
