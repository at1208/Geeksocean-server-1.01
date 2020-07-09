const express = require('express');
const router = express.Router();

//import controllers
const { createKeyword,list, read, remove} = require('../controllers/keyword');
const { requireSignin, adminMiddleware } = require('../controllers/auth');

//routes
router.post('/createKeyword',requireSignin, adminMiddleware, createKeyword);
router.get('/keywords', list);
router.get('/keyword/:slug', read);
router.delete('/keyword/:slug', requireSignin, adminMiddleware, remove);

module.exports = router;
