// config/index.js
const apiVersion = "v1"; // Change this to your desired version

const routes = [
  { path: "/auth", route: require("../routes/authRouter") },
  { path: "/address", route: require("../routes/addressRouter") },
  { path: "/type", route: require("../routes/type/index") },
  { path: "/subType", route: require("../routes/subType/index") },
  { path: "/product", route: require("../routes/product") },
  { path: "/order", route: require("../routes/order") },
  { path: "/room", route: require("../routes/roomRouter") },
  { path: "/cart", route: require("../routes/cart") },
  { path: "/warehouse", route: require("../routes/warehouse") },
  { path: "/", route: require("../routes/protectedRouter") },
];

const configureRoutes = (app) => {
  routes.forEach(({ path, route }) => {
    app.use(`/api/${apiVersion}${path}`, route);
  });
};

module.exports = { configureRoutes };
