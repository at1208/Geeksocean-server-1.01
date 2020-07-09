const express = require('express');
const router = express.Router();

const { runValidation } = require('../validators');
const { popularCreateValidator } = require('../validators/popular');

//import controllers
const { createPopular, removePopular, listOfPopularBlogs, updatePopularBlog} = require('../controllers/popular');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

//routes
router.post('/blog/createPopular',popularCreateValidator,runValidation,createPopular);
router.get('/blog/popularBlogs', listOfPopularBlogs);
router.patch('/blog/updatePopularBlog/:id', updatePopularBlog);
router.delete('/blog/removePopular/:id',removePopular);

module.exports = router;
