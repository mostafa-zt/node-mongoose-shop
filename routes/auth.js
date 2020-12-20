const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

const isAuth = require('../middleware/isAuth');

const { check, validationResult, body } = require('express-validator');
const AuthValidator = require('../validation/authValidator');

//Home Page
router.get('/login/', authController.getLogin);
router.post('/login/', authController.postLogin);
router.get('/signup/', authController.getsignup);
// router.post('/signup/', body('email', 'this email in not valid').isEmail(), authController.postsignup);
router.post('/signup/',  AuthValidator.checkSignup(), authController.postsignup);
router.get('/logout/', authController.getlogout);

module.exports = router;