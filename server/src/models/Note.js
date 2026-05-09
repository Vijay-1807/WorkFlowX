const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'New Note',
  },
  content: {
    type: String,
    default: '',
  }
}, { timestamps: true });

// Virtual to duplicate _id as id
noteSchema.virtual('id').get(function() {
  return this._id.toHexString();
});
noteSchema.set('toJSON', { virtuals: true });
noteSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Note', noteSchema);
