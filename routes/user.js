const express = require('express');
const router = express.Router();
const { requireSignin, authMiddleware, adminMiddleware } = require('../controllers/auth');
const { read, publicProfile, update, photo, users, userById } = require('../controllers/user');

router.get('/user/profile', requireSignin, authMiddleware, read);
router.get('/user/:username', publicProfile);
router.patch('/user/update', requireSignin, authMiddleware, update);
router.get('/user/photo/:username', photo);
router.get('/users',requireSignin,adminMiddleware, users);
router.get('/user/userdata/:id', userById);

module.exports = router;
