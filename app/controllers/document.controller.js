var Document = require('../models/document.model');

// this method creates a new document
exports.createDoc = function(req, res) {
  var doc = new Document();
  doc.ownerId = req.body.ownerId;
  doc.title = req.body.title;
  doc.content = req.body.content;

  doc.save(function(err) {
    if (!doc.title) {
      return res.status(401).send({
        success: false,
        message: 'Please Enter A Document Title!'
      });
    }
    else if (!doc.content) {
      return res.status(401).send({
        success: false,
        message: 'Content Field Cannot Be Empty!'
      });
    }
    else if (err) {
      if (err.code === 11000) {
        return res.status(401).send({
          success: false,
          message: 'Document Title Already Exists!'
        });
      }
      else {
        return res.status(401).send(err);
      }
    }
    else {
      return res.send({
        success: true,
        message: 'Document Created.'
      });
    }
  });
};

// this method returns all created documents
exports.getAllDocs = function(req, res) {
  Document.find({}).exec(function(err, docs) {
    if (err) {
      res.send(err);
    } 
    else if (!docs) {
      res.status(404).send({
        success: false,
        message: 'Douments Not Found!'
      });
    } 
    else {
      res.json(docs);
    }
  });
};

// this method returns a single document
exports.getDoc = function(req, res) {
  Document.find({_id: req.params.id}, function(err, doc) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(doc);
    }
  });
};

// this method allows documents to be edited
exports.editDoc = function(req, res) {
  Document.findByIdAndUpdate(req.params.id, req.body, function(err, doc) {
    res.send({
      success: true,
      message: 'Document Updated!'
    });
  });
};

// this method deletes single document
exports.deleteDoc = function(req, res) {
  Document.findById(req.params.id).remove(function(err, doc) {
    if (err) {
      return res.send(err);
    }
    else {
      res.send({
        success: true,
        message: 'Document Deleted'
      });
    }
  });
};
