var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var app = require('../../server');
var request = require('supertest')(app);
var config = require('../../config/config');
var User = mongoose.model('User');
var Document = mongoose.model('Document');

var user = null;
var doc = null;
user = {
  username: 'dbanjbangalee',
  first: 'dbanj',
  last: 'bangalee',
  email: 'dbanjbangalee@gmail.com',
  password: 'dbrecords'
};
user = new User();
token = jwt.sign(user, config.secret, { expiresIn: 1440 });

describe('Document route test', function() {
  it('should create a new document with complete fields.', function(done) {
    doc = {
      ownerId: user._id,
      title: 'tales by the moonlight',
      content: 'once upon a time'
    };
    request.post('/api/documents')
    .send(doc)
    .expect(200)
    .end(function(err){
      expect(err).toBe(null);
      done();
    });
  });
  it('should not create a new document with undefined document title.', function(done) {
    doc = {
      ownerId: user._id,
      title: undefined,
      content: 'once upon a time'
    };
    request.post('/api/documents')
    .send(doc)
    .expect(401)
    .end(function(err, response) {
      expect(response.body).toEqual(jasmine.objectContaining({
        success: false,
        message: 'Please Enter A Document Title!'}));
      done();
    });
  });
  it('should not create a new document with an undefined title.', function(done) {
    doc = {
      ownerId: user._id,
      title: undefined,
      content: 'once upon a time'
    };
    request.post('/api/documents')
    .send(doc)
    .expect(401)
    .end(function(err, response) {
      expect(response.body).toEqual(jasmine.objectContaining({
        success: false,
        message: 'Please Enter A Document Title!'}));
      done();
    });
  });
  it('should not create a new document with an empty content field.', function(done) {
    doc = {
      ownerId: user._id,
      title: 'tales by the moonlight',
      content: undefined
    };
    request.post('/api/documents')
    .send(doc)
    .expect(401)
    .end(function(err, response) {
      expect(response.body).toEqual(jasmine.objectContaining({
        success: false,
        message: 'Content Field Cannot Be Empty!'}));
      done();
    });
  });
});

describe('Document route test', function() {
  beforeEach(function(done) {
    doc = new Document();
    Document.remove({}, function() {
      doc.ownerId = user._id,
      doc.title = 'this is a title',
      doc.content = 'welcome to the jungle' 
      doc.save(function(err, doc) {
        id = doc._id;
      });
    });
    done();
  });
  it('should return all documents', function(done) {
    request.get('/api/documents')
    .expect(200)
    .end(function(err, res){
      expect(err).toBe(null);
      expect(res.body.length).toEqual(1);
      done();
    });
  });
  it('should return a single document', function(done) {
    request.get('/api/documents/' + id)
    .expect(200)
    .end(function(err, res){
      expect(err).toBe(null);
      expect(doc.title).toBe('this is a title');
      done();
    });
  });
  it('should return all documents belonging to a user', function(done) {
    request.get('/api/users/' + user._id + '/documents')
    .set('x-access-token', token)
    .expect(200)
    .end(function(err, docs){
      expect(err).toBe(null);
      expect(docs.body.length).toEqual(1);
      done();
    });
  });
  it('should edit a document', function(done) {
    request.put('/api/documents/' + id)
    .expect(200)
    .send({content: 'there was a man'})
    .end(function(err, res){
      expect(res.body).toEqual(jasmine.objectContaining({
        success: true,
        message: 'Document Updated!'}));
      done();
    });
  })
  it('should delete a document', function(done) {
    request.delete('/api/documents/' + id)
    .expect(200)
    .end(function(err, res){
      expect(res.body).toEqual(jasmine.objectContaining({
        success: true,
        message: 'Document Deleted'}));
      done();
    });
  });
});
