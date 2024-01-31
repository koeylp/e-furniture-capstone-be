// config/index.js
const apiVersion = "v1"; // Change this to your desired version

const routes = [
  { path: "/auth", route: require("../routes/authRouter") },
  { path: "/address", route: require("../routes/addressRouter") },
  { path: "/type", route: require("../routes/typeRouter") },
  { path: "/product", route: require("../routes/product") },
  { path: "/room", route: require("../routes/roomRouter") },
  { path: "/", route: require("../routes/protectedRouter") },
  { path: "/cart", route: require("../routes/cart") },
];

const configureRoutes = (app) => {
  routes.forEach(({ path, route }) => {
    app.use(`/api/${apiVersion}${path}`, route);
  });
};

module.exports = { configureRoutes };
