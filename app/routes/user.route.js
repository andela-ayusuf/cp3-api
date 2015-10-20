var userCtrl = require('../controllers/user.controller');

function userRoutes(router) {
  router.route('/users/login')
    .post(userCtrl.login);

  router.route('/users/logout')
    .post(userCtrl.logout);
  
  router.route('/users')
    .post(userCtrl.createUser)
    .get(userCtrl.middleware, userCtrl.getAllUsers);

  router.route('/users/:id')
    .get(userCtrl.middleware, userCtrl.getUser)
    .put(userCtrl.middleware, userCtrl.editUser)
    .delete(userCtrl.middleware, userCtrl.deleteUser);

  router.route('/users/:id/documents')
    .get(userCtrl.middleware, userCtrl.getUserDocs);
}

module.exports = userRoutes;
