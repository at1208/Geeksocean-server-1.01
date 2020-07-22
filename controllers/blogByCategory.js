// const express = require('express');
// const router = express.Router();
// const BlogByCategory =  require('../models/blogByCategory');
//
// exports.create = async (req, res) => {
//    const { blogs } = req.body
//    const x = await BlogByCategory.find()
//
//    if(x.length>0){
//         console.log(blogs)
//     return  BlogByCategory.findByIdAndUpdate(x._id, {blogs: blogs}, (err, result) => {
//        if(err){
//          return res.status(400).json({
//            error: err
//          })
//        }
//       return  res.status(200).json({
//          result: result
//        })
//      })
//    }
//
//    // const newBlogs = BlogByCategory({
//    //   blogs: categories
//    // })
//    //    newBlogs.save((err, result) => {
//    //      if(err){
//    //        return res.status(400).json({
//    //          error: err
//    //        })
//    //      }
//    //      return res.status(200).json({
//    //        result
//    //      })
//    //    })
// };
