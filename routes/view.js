const express = require("express");
const router = express.Router();

const {
  view,
  getArticleViews,
  getTrendingArticle
} = require("../controllers/view");


router.post('/views',view);
router.get('/article/views',getArticleViews);
router.get('/articles/popular',getTrendingArticle);

module.exports = router;
