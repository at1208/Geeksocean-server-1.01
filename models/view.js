const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const viewSchema = new mongoose.Schema(
    {
      slug: {
          type: String,
          required: true,
          unique: true
      },
      blog: {
          type: ObjectId,
          ref: "Blog",
          required: true
           },
      views: {
        type: Number,
        default: 1
      }
    },
    { timestamps: true }
);

module.exports = mongoose.model('View', viewSchema);
