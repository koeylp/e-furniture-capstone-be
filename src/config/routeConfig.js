// config/index.js
const apiVersion = "v1"; // Change this to your desired version

const routes = [
  { path: "/auth", route: require("../routes/authRouter") },
  { path: "/address", route: require("../routes/addressRouter") },
  { path: "/type", route: require("../routes/typeRouter") },
  { path: "/product", route: require("../routes/productRouter") },
  { path: "/room", route: require("../routes/roomRouter") },
  { path: "/", route: require("../routes/protectedRouter") },
];

const configureRoutes = (app) => {
  routes.forEach(({ path, route }) => {
    app.use(`/api/${apiVersion}${path}`, route);
  });
};

module.exports = { configureRoutes };
