// config/index.js
const apiVersion = "v1"; // Change this to your desired version
const { PermissionConstants } = require("../utils/roleConstant");
global.PermissionConstants = PermissionConstants;

const routes = [
  { path: "/auth", route: require("../routes/authRouter") },
  { path: "/address", route: require("../routes/address") },
  { path: "/type", route: require("../routes/type") },
  { path: "/subtype", route: require("../routes/subType") },
  { path: "/product", route: require("../routes/product") },
  { path: "/order", route: require("../routes/order") },
  { path: "/cart", route: require("../routes/cart") },
  { path: "/warehouse", route: require("../routes/warehouse") },
  { path: "/voucher", route: require("../routes/voucher") },
  { path: "/wishlist", route: require("../routes/wishlist") },
  { path: "/account", route: require("../routes/account") },
  { path: "/showroom", route: require("../routes/showroom") },
  { path: "/attribute", route: require("../routes/attribute") },
  { path: "/group", route: require("../routes/group") },
  { path: "/role", route: require("../routes/role") },
  { path: "/room", route: require("../routes/room") },
  { path: "/district", route: require("../routes/district") },
  { path: "/flashsale", route: require("../routes/flashSale") },
  { path: "/revenue", route: require("../routes/revenue") },
  { path: "/inventory", route: require("../routes/inventory") },
];

const configureRoutes = (app) => {
  routes.forEach(({ path, route }) => {
    app.use(`/api/${apiVersion}${path}`, route);
  });
};

module.exports = { configureRoutes };
