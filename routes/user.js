var express = require('express');
const jwt = require('../helpers/jwt');
const mids = require('../helpers/middlewares');
const validation = require('../helpers/validation');

//controllers
const userController = require('../controller/user.controller');

var router = express.Router();

/****** Routes. ******/
router.get('/', userController.home);

//user api routes
router.get('/userdata', jwt.verify, mids.verify_user,userController.userData)
router.post('/updateUserProfile', jwt.verify, mids.verify_user, validation.userUpdateValidate, userController.userUpdate)
router.post('/setAvatar', jwt.verify, mids.verify_user, mids.multer_init({route:'avatar',filename:'userAvatar'}) , userController.avatarUpload)

//not in use
router.get('/test', jwt.verify, userController.test);
module.exports = router;
