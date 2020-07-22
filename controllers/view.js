const Views =  require('../models/view');


exports.view = async (req,res) => {
  const { slug, _id } = req.body
  if(!slug && !_id){
    return res.status(400).json({
      error: "Slug and _id is undefined"
    })
  }
  const result = await  Views.findOne({slug})
  if(!result){
     const newView = Views({
       slug,
       blog: _id
     })
     return newView.save((err, result) => {
       if(err){
         return res.status(400).json({
           error: err
         })
       }
       return res.status(200).json({
         result
       })
     })
  }
  Views.findOneAndUpdate({slug},{ $inc: { views: 1 } }, {new: true },(err, result) => {
    if(err){
      return res.status(400).json({
        error: err
      })
    }
    return res.status(200).json({
      result
    })
  })
}


exports.getArticleViews = (req, res) => {
  const {slug} = req.body
  Views.findOne({slug})
  .populate({ path: 'blog',select:'title', populate: { path: 'postedBy', select: 'name' }})
  .select('views')
  .exec((err, result) => {
    if(err){
      return res.status(400).json({
        error: err
      })
    }
    return res.status(200).json({
      result
    })
  })
}


exports.getTrendingArticle = (req, res) => {
  Views.find()
  .sort({ views: -1, createdAt: -1 })
  .limit(5)
  .populate({ path: 'blog',select:'title slug', populate: { path: 'postedBy', select: 'name' }})
  .select('views')
  .exec((err, result) => {
    if(err){
      return res.status(400).json({
        error: err
      })
    }
    return res.status(200).json({
      result
    })
  })
}
