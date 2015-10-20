var docCtrl = require('../controllers/document.controller');

function docRoutes(router) {
  router.route('/documents')
    .post(docCtrl.createDoc)
    .get(docCtrl.getAllDocs);

  router.route('/documents/:id')
    .get(docCtrl.getDoc)
    .put(docCtrl.editDoc)
    .delete(docCtrl.deleteDoc);
}

module.exports = docRoutes;