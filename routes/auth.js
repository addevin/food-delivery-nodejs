
const authController = require('../controller/auth.controller');
const middlewares = require('../helpers/middlewares');
const { signupValidate, loginValidate } = require('../helpers/validation');
let router = require('express').Router()

router.post('/signup', signupValidate, authController.signup)
router.post('/login', loginValidate,  authController.login)
router.get('/generate-token', authController.tokenGen)


module.exports = router;