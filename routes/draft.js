const express = require('express');
const router = express.Router();
const {
 createDraft,
 updateDraft,
 removeDraft,
 readDraft,
 listOfDraftByUser
} = require('../controllers/draft');

const { requireSignin, adminMiddleware, authMiddleware, canUpdateDeleteBlog } = require('../controllers/auth');

router.post('/blogs/createDraft',requireSignin, adminMiddleware, createDraft);
router.get('/:username/draft', listOfDraftByUser);
router.put('/blog/updateDraft/:slug', requireSignin, adminMiddleware, updateDraft);
router.delete('/blog/removeDraft/:slug', requireSignin, adminMiddleware, removeDraft);
router.get('/blog/readDraft/:slug', readDraft);

module.exports = router;
