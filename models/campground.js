const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
}, {usePushEach: true})
module.exports = mongoose.model('Campground', schema)