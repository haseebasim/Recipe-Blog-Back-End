const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  name: {
    type: String,

    required: true,
  },

  comment_text: {
    type: String,
    required: true,
  },

  post_id: {
    type: mongoose.ObjectId,
    required: true
  },
});



const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment