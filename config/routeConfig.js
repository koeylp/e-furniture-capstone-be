// src/config/routeConfig.js
const routes = [
  // { path: '/products', route: require('../routes/productRoute') },
  // { path: '/categories', route: require('../routes/categoryRoute') },
  // { path: '/address', route: require('../routes/addressRoute') },
  { path: "/auth", route: require("../src/routes/authRouter") },
  // { path: '/user', route: require('../routes/userRoute') },
  // { path: '/orders', route: require('../routes/orderRoute') },
  // { path: '/cart', route: require('../routes/cartRoute') },
];

const configureRoutes = (app) => {
  routes.forEach(({ path, route }) => {
    app.use(path, route);
  });
};

module.exports = { configureRoutes };
