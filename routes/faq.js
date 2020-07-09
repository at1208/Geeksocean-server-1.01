const express = require('express');
const router = express.Router();

//import controllers
const { createFAQ, listAllFAQ, removeFAQ, singleFAQ, updateFAQ } = require('../controllers/faq');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

//routes
router.post('/blog/createFAQ', createFAQ);
router.post('/blog/allFAQ',requireSignin, adminMiddleware, listAllFAQ);
router.delete('/blog/removeFAQ/:_id',requireSignin, adminMiddleware ,removeFAQ);
router.get('/blog/singleFAQ/:_id', singleFAQ);
router.patch('/blog/updateFAQ/:_id', updateFAQ);

module.exports = router;
