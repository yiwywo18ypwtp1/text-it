const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


router.post('/signup', userController.signUp);
router.get('/me', userController.getCurrentUser);

module.exports = router;