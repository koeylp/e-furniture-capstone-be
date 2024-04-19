class PermissionConstants {
  static USER_GET = "User_Get";
  static USER_POST = "User_Post";
  static USER_PUT = "User_Put";
  static USER_DELETE = "User_Delete";
  static STAFF_GET = "Staff_Get";
  static STAFF_POST = "Staff_Post";
  static STAFF_PUT = "Staff_Put";
  static STAFF_DELETE = "Staff_Delete";
  static ADMIN_GET = "Admin_Get";
  static ADMIN_POST = "Admin_Post";
  static ADMIN_PUT = "Admin_Put";
  static ADMIN_DELETE = "Admin_Delete";
  static DELIVERY_GET = "Delivery_Get";
  static DELIVERY_POST = "Delivery_Post";
  static DELIVERY_PUT = "Delivery_Put";
  static DELIVERY_DELETE = "Delivery_Delete";
  static ADMIN_MASTER_GET = "AdminMaster_Get";
  static ADMIN_MASTER_POST = "AdminMaster_Post";
  static ADMIN_MASTER_PUT = "AdminMaster_Put";
  static ADMIN_MASTER_DELETE = "AdminMaster_Delete";
}
const rolePhase = new Map([
  [1, "User_Get"],
  [2, "User_Post"],
  [3, "User_Put"],
  [4, "User_Delete"],
  [5, "Staff_Get"],
  [6, "Staff_Post"],
  [7, "Staff_Put"],
  [8, "Staff_Delete"],
  [9, "Admin_Get"],
  [10, "Admin_Post"],
  [11, "Admin_Put"],
  [12, "Admin_Delete"],
  [13, "Delivery_Get"],
  [14, "Delivery_Post"],
  [15, "Delivery_Put"],
  [16, "Delivery_Delete"],
  [17, "AdminMaster_Get"],
  [18, "AdminMaster_Post"],
  [19, "AdminMaster_Put"],
  [20, "AdminMaster_Delete"],
]);
const getRolePhase = (code) => {
  return rolePhase.get(code) || rolePhase.get("default");
};
module.exports = {
  PermissionConstants,
  getRolePhase,
};
