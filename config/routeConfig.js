// src/config/routeConfig.js
const routes = [
  { path: "/auth", route: require("../src/routes/authRouter") },
];

const configureRoutes = (app) => {
  routes.forEach(({ path, route }) => {
    app.use(path, route);
  });
};

module.exports = { configureRoutes };
