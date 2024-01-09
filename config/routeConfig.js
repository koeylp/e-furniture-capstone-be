// config/index.js
const apiVersion = 'v1'; // Change this to your desired version

const routes = [
  { path: '/auth', route: require('../src/routes/authRouter') },
  { path: '/', route: require('../src/routes/protectedRouter') },
];

const configureRoutes = (app) => {
  routes.forEach(({ path, route }) => {
    app.use(`/api/${apiVersion}${path}`, route);
  });
};

module.exports = { configureRoutes };
