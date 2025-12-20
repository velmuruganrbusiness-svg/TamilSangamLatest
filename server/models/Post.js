
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['கவிதை', 'கட்டுரை', 'மேற்கோள்', 'கதை', 'பொன்மொழி', 'ஊக்கம்', 'வரலாறு', 'பழமொழி']
  },
  author: {
    id: Number,
    name: String,
    avatarUrl: String
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    user: {
      id: Number,
      name: String,
      avatarUrl: String
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', PostSchema);
