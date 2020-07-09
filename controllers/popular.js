const Popular = require('../models/popular');


exports.createPopular = async (req,res) => {

  const { articleId, articleRank } = req.body

  const newPopular = Popular({
    articleId,
    articleRank
  })
  await newPopular.save((err,result) => {
    if(err){
      res.status(400).json({
         error:"Failed to create popular article"
      })
    }
    else{
      res.status(200).json({
        msg:"successfully added to the popular section",
        result
      })
    }
  })
}

exports.removePopular = async (req,res) => {
   Popular.findByIdAndRemove(req.params.id).exec((err,result) => {
     if(err){
       res.status(400).json({
         error:"Failed to remove from popular section"
       })
     } else{
       res.status(200).json({
         msg: "successfully removed from popular section",
         result
       })
     }
   })
}

exports.listOfPopularBlogs = async (req,res) => {
  Popular.find({}).exec((err, data) => {
      if (err) {
          return res.status(400).json({
              error: "Failed to load popular blogs"
          });
      }
      res.json(data);
  });
}

exports.updatePopularBlog = async (req,res) => {
  const updatedInfo = { articleRank: req.body.articleRank}
  Popular.findByIdAndUpdate({ _id: req.params.id}, updatedInfo, (err,result) => {
    if(err){
      res.status(400).json({
        error:"failed to update popular blog"
      })
    }else{
      res.status(200).json({
        msg:"successfully updated popular blog",
        result
      })
    }
  })
}
