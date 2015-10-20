var jwt = require('jsonwebtoken');
var User = require('../models/user.model');
var config = require('../../config/config');

exports.createUser = function(req, res) {
  var user = new User();
  user.username = req.body.username;
  user.name = {
    first: req.body.first,
    last: req.body.last
  };
  user.email = req.body.email;
  user.password = req.body.password;

  user.save(function(err) {
    if (!user.username || !user.email || !user.password) {
      return res.status(401).send({
        success: false,
        message: 'Invalid Username or Email or Password!'
      });
    }
    else if (!user.name.first || !user.name.first) {
      return res.status(401).send({
        success: false,
        message: 'Invalid Firstname or Lastname!'
      });
    }
    else if (err) {
      if (err.code === 11000) {
        return res.status(403).send({
          success: false,
          message: 'Username Already Exists!'
        });
      }
      else {
        return res.status(402).send(err);
      }
    }
    else {
      return res.status(200).send({
        success: true,
        message: 'User Created.'
      });
    }
  });
};

exports.login = function(req, res) {
  User.findOne({
    username: req.body.username})
      .select('username password')
      .exec(function(err, user) {
    if (err) {
      throw err;
    }
    if (!user) {
      return res.status(401).send({
        success: false,
        message: 'Invalid Username or Password!'
      });
    }
    else {
      var validPassword = user.comparePassword(req.body.password);
      if (!validPassword) {
        return res.status(401).send({
          success: false,
          message: 'Invalid Username or Password!'
        });
      }
      else {
        var token = jwt.sign(user, config.secret, {
          expiresIn: 1440
        });
        res.json({
          success: true,
          message: 'Token generated.',
          token: token
        });
      }
    }
  });
};

exports.middleware = function(req, res, next) {
  var token = req.body.token ||
    req.query.token ||
    req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ 
          success: false,
          message: 'Failed to authenticate token.' });
      }
      else {
        req.decoded = decoded;
        next();
      }
    });
  }
  else {
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });
  }
};

exports.logout = function(req, res) {
  req.session.destroy(function(err, success) {
    if (err) {
      res.send(err);
    } 
    else {
      res.send({
        success: true,
        message: 'You have logged out.'
      });
    }
  });
};

exports.getAllUsers = function(req, res) {
  User.find({}).exec(function(err, users) {
    if (err) {
      res.send(err);
    } 
    else if (!users) {
      res.status(404).send({
        success: false,
        message: 'Users not found!'
      });
    } 
    else {
      res.json(users);
    }
  });
};

exports.getUser = function(req, res) {
  User.find({_id: req.params.id}, function(err, user) {
    if (err) {
      res.send(err);
    }
    else {
      res.json(user);
    }
  });
};

exports.getUserDocs = function(req, res) {
  Document.find({ownerId: req.params.id}).exec(function(err, docs) {
    if (err) {
      res.send(err);
    } 
    else if (!docs) {
      res.status(404).send({
        success: false,
        message: 'Documents Not Found!'
      });
    } 
    else {
      res.json(docs);
    }
  });
};

exports.editUser = function(req, res) {
  User.update({_id: req.params.id},req.body, function() {
    res.send({
      success: true,
      message: 'User Updated!'
    });
  });
};

exports.deleteUser = function(req, res) {
  User.remove({_id: req.params.id},
    function(err) {
    if (err) {
      return res.send(err);
    }
    else {
      res.send({
        success: true,
        message: 'User Deleted'
      });
    }
  });
};

