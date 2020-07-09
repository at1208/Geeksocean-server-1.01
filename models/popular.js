const mongoose = require('mongoose');

const popularSchema = mongoose.Schema({
     articleId: {
       type: String,
       required: true
     },
     articleRank: {
       type: Number,
       unique: true,
       required: true
     }
})

module.exports = mongoose.model('PopularBlog',popularSchema);
