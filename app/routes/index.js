var userRoutes = require('./user.route');
var docRoutes = require('./document.route');

function routes(router) {
  userRoutes(router);
  docRoutes(router);
}

module.exports = routes;