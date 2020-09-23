const express = require('express');
// const IP = require('../middlewares/blog').IP;

const router = express.Router();
const {
    create,
    list,
    listAllBlogsCategoriesTags,
    read,
    remove,
    update,
    photo,
    listRelated,
    listSearch,
    listByUser,
    blogComments,
    blogCommentsById,
    getPendingBlogs,
    approveBlog,
    updateSingleBlog
} = require('../controllers/blog');

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/auth');

router.post('/blog', requireSignin, adminMiddleware, create);
router.get('/blogs', requireSignin, adminMiddleware, list);
router.post('/blogs-categories-tags', listAllBlogsCategoriesTags);
router.get('/blog/:slug',read);
router.delete('/blog/:slug', requireSignin, adminMiddleware, remove);
router.put('/blog/:slug', requireSignin, adminMiddleware, update);
router.get('/blog/photo/:slug', photo);
router.post('/blogs/related', listRelated);
router.get('/blogs/search', listSearch);

router.get('/pending/blogs',getPendingBlogs)
router.patch('/pending/blogs/approval/:blogId',requireSignin, adminMiddleware,approveBlog)

// auth user blog crud
router.get('/blog/notapprove/:slug',requireSignin, authMiddleware,updateSingleBlog);
router.post('/user/blog', requireSignin, authMiddleware, create);
router.get('/:username/blogs', listByUser);
router.delete('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, remove);
router.put('/user/blog/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);
router.patch('/blog/blog-comment/:blogId',blogComments);
router.get('/blog/all-blog-comment/:blogId',blogCommentsById);


module.exports = router;
