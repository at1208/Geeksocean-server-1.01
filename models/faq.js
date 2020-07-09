const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema(
    {
      body: {
          type: {},
          required: true,
      }
    },
    { timestamps: true }
);

module.exports = mongoose.model('FAQ', faqSchema);
