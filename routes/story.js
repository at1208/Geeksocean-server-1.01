const express = require('express');

const router = express.Router();
const {
    create,
    list,
    listAllStoriesCategoriesTags,
    read,
    remove,
    update,
    photo,
    listRelated,
    listSearch,
    listByUser,
} = require('../controllers/story');

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/auth');

router.post('/story', requireSignin, adminMiddleware, create);
router.get('/stories', list);
router.post('/stories-categories-tags', listAllStoriesCategoriesTags);
router.get('/story/:slug',read);
router.delete('/story/:slug', requireSignin, adminMiddleware, remove);
router.put('/story/:slug', requireSignin, adminMiddleware, update);
router.get('/story/photo/:slug', photo);
router.post('/stories/related', listRelated);




// auth user blog crud
router.post('/user/story', requireSignin, authMiddleware, create);
router.get('/:username/stories', listByUser);
router.delete('/user/story/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, remove);
router.put('/user/story/:slug', requireSignin, authMiddleware, canUpdateDeleteBlog, update);



module.exports = router;
