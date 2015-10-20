var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var app = require('../../server');
var request = require('supertest')(app);
var config = require('../../config/config');
var User = mongoose.model('User');

describe('User route test', function() {
  it('should create a new user with complete credentials', function(done) {
    var user = {
      username: 'olamidebaddo',
      first: 'olamide',
      last: 'baddo',
      email: 'olamidebaddo@gmail.com',
      password: 'ybnlybnl'
    };
    request.post('/api/users')
    .send(user)
    .expect(200)
    .end(function(err){
      expect(err).toBe(null);
      done();
    });
  });

  it('should not create a new user with duplicate credentials', function(done) {
    user = {
      username: 'olamidebaddo',
      first: 'olamide',
      last: 'baddo',
      email: 'olamidebaddo@gmail.com',
      password: 'ybnlybnl'
    };
    request.post('/api/users')
    .send(user)
    .expect(401)
    .end(function(err, response) {
      expect(response.body).toEqual(jasmine.objectContaining({
          success: false,
          message: 'Username Already Exists!'}));
      done();
    });
  });

  it('should not create a new user with an undefined username', function(done) {
    user = {
      username: undefined,
      first: 'olamide',
      last: 'baddo',
      email: 'olamidebaddo@gmail.com',
      password: 'ybnlybnl'
    };
    request.post('/api/users')
    .send(user)
    .expect(401)
    .end(function(err, response) {
      expect(response.body).toEqual(jasmine.objectContaining({
          success: false,
          message: 'Invalid Username or Email or Password!'
      }));
      done();
    });
  });

  it('should not create a new user with an undefined firstname', function(done) {
    user = {
      username: 'olamidebaddo',
      first: undefined,
      last: 'baddo',
      email: 'olamidebaddo@gmail.com',
      password: 'ybnlybnl'
    };
    request.post('/api/users')
    .send(user)
    .expect(401)
    .end(function(err, response) {
      expect(response.body).toEqual(jasmine.objectContaining({
          success: false,
          message: 'Invalid Firstname or Lastname!'
      }));
      done();
    });
  });

  it('should not create a new user with an undefined email', function(done) {
    user = {
      username: 'olamidebaddo',
      first: 'olamide',
      last: 'baddo',
      email: undefined,
      password: 'ybnlybnl'
    };
    request.post('/api/users')
    .send(user)
    .expect(401)
    .end(function(err, response) {
      expect(response.body).toEqual(jasmine.objectContaining({
          success: false,
          message: 'Invalid Username or Email or Password!'
      }));
      done();
    });
  });

  it('should not create a new user with an undefined password', function(done) {
    user = {
      username: 'olamidebaddo',
      first: 'olamide',
      last: 'baddo',
      email: 'olamidebaddo@gmail.com',
      password: undefined
    };
    request.post('/api/users')
    .send(user)
    .expect(401)
    .end(function(err, response) {
      expect(response.body).toEqual(jasmine.objectContaining({
          success: false,
          message: 'Invalid Username or Email or Password!'
      }));
      done();
    });
  });

  it('should login a user with correct credentials', function(done) {
    user = {
      username: 'olamidebaddo',
      password: 'ybnlybnl'
    };
    request.post('/api/users/login')
    .send(user)
    .expect(200)
    .end(function(err){
      expect(err).toBe(null);
      done();
    });
  });

  it('should not login a user with incorrect username', function(done) {
    user = {
      username: 'lilkesh',
      password: 'ybnlybnl'
    };
    request.post('/api/users/login')
    .send(user)
    .expect(401)
    .end(function(err, response) {
      expect(response.body).toEqual(jasmine.objectContaining({
        success: false,
        message: 'Invalid Username or Password!'
      }));
      done();
    });
  });

  it('should not login a user with wrong password', function(done) {
    user = {
      username: 'olamidebaddo',
      password: 'mohits'
    };
    request.post('/api/users/login')
    .send(user)
    .expect(401)
    .end(function(err, response) {
      expect(response.body).toEqual(jasmine.objectContaining({
        success: false,
        message: 'Invalid Username or Password!'
      }));
      done();
    });
  });

  it('should log a user out', function(done) {
    user = {
      username: 'olamidebaddo',
      password: 'ybnlybnl'
    };
    request.post('/api/users/logout')
    .send(user)
    .expect(200)
    .end(function(err, response) {
      expect(err).toBe(null);
      expect(response.body).toEqual(jasmine.objectContaining({
          success: true,
          message: 'You have logged out.'
      }));
      done();
    });
  });
});

describe('User route test', function() {

  beforeEach(function(done) {
    user = new User();
      User.remove({}, function() {
        user.username = 'donjazzy';
        user.name = { first: 'don', last: 'jazzy'};
        user.email = 'donjazzy@gmail.com';
        user.password = 'mavin';
        user.save(function(err, user) {
          id = user._id;
        });
      });
    token = jwt.sign(user, config.secret, { expiresIn: 1440 });
    done();
  });

  it('should return all users', function(done) {
    request.get('/api/users')
    .set('x-access-token', token)
    .expect(200)
    .end(function(err, res){
      expect(err).toBe(null);
      expect(res.body.length).toEqual(1);
      done();
    });
  });

  it('should return a single user', function(done) {
    request.get('/api/users/' + id)
    .set('x-access-token', token)
    .expect(200)
    .end(function(err, res){
      expect(err).toBe(null);
      expect(user.username).toBe('donjazzy');
      done();
    });
  });

  it('should not return a user without token', function(done) {
    request.get('/api/users/' + id)
    .expect(403)
    .end(function(err, response) {
      expect(response.body).toEqual(jasmine.objectContaining( {
        success: false,
        message: 'No token provided.'
      }));
      done();
    });
  });

  it('should edit a user details', function() {
    user = {
      username:'wizkid'
    };
    request.put('/api/users/' + id)
    .set('x-access-token', token)
    .expect(200)
    .send(user)
    .end(function(err, res){
      expect(err).toBe(null);
    });
  });

  it('should delete a user', function(done) {
    request.delete('/api/users/' + id)
    .set('x-access-token', token)
    .expect(200)
    .end(function(err, res){
      expect(res.body).toEqual(jasmine.objectContaining({
        success: true, 
        message: 'User Deleted'
      }));
      done();
    });
  });
});
