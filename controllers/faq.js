const FAQ = require('../models/faq');
const { errorHandler } = require('../helpers/dbErrorHandler');



exports.createFAQ= async (req, res) => {
    const { name } = req.body;
    const faq = new FAQ({ body: name });
  await faq.save((err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};


exports.listAllFAQ = async (req, res) => {
    await FAQ.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.removeFAQ = (req,res) => {
  const  faqId = req.params._id
  FAQ.findOneAndRemove({ _id: faqId }).exec((err, data) => {
      if (err) {
          return res.status(400).json({
              error: errorHandler(err)
          });
      }
      res.json({
          message: 'FAQ deleted successfully'
      });
  });
}

exports.singleFAQ = async (req,res) => {
  const faqId = req.params._id
  await FAQ.findOne({_id: faqId }).exec((err,result) => {
   if(err){
     res.json({
        error: err
     })
   }
   res.json({
     result: result
   })
  })
}

exports.updateFAQ = async (req,res) => {
  const updatedInfo = req.body.name
  console.log(updatedInfo)
  const faqId = req.params._id
  const findResult = await FAQ.findById(faqId);
  await FAQ.findByIdAndUpdate({ _id: faqId },{body: updatedInfo }).exec((err, result) => {
    if(err){
      res.json({
        error: err
      })
    }
    res.json({
      msg:'FAQ successfully updated',
      result: result
    })
  })
}
