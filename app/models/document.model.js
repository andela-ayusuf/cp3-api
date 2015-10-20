var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var docSchema = new Schema({
  ownerId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: new Date()
  },
  lastModified: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model('Document', docSchema);
