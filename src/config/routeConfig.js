// config/index.js
const apiVersion = "v1"; // Change this to your desired version

const routes = [
  { path: "/auth", route: require("../routes/authRouter") },
  { path: "/address", route: require("../routes/address") },
  { path: "/type", route: require("../routes/type") },
  { path: "/subtype", route: require("../routes/subType") },
  { path: "/product", route: require("../routes/product") },
  { path: "/order", route: require("../routes/order") },
  { path: "/room", route: require("../routes/roomRouter") },
  { path: "/cart", route: require("../routes/cart") },
  { path: "/warehouse", route: require("../routes/warehouse") },
  { path: "/voucher", route: require("../routes/voucher") },
  { path: "/wishlist", route: require("../routes/wishlist") },
  { path: "/account", route: require("../routes/account") },
  { path: "/showroom", route: require("../routes/showroom") },
];

const configureRoutes = (app) => {
  routes.forEach(({ path, route }) => {
    app.use(`/api/${apiVersion}${path}`, route);
  });
};

module.exports = { configureRoutes };
