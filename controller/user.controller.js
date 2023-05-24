
let users = require('../model/users')
const multer = require('multer');
const path = require('path');
let { check, validationResult } = require('express-validator');
const funs = require('../helpers/funs');
const { hashPassword } = require('../helpers/validation');


// Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload  
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000000 }, // 10MB
  fileFilter: function(req, file, callback) {
    checkFileType(file, callback);
  }
}).single('avatar'); // 'avatar' is the name attribute of the input file element in the form

function checkFileType(file, callback) {
  const filetypes = /jpeg|jpg|png|gif/; // Allowed file extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
console.log(file.originalname,"filename#");
  if (mimetype && extname) {
    return callback(null, true);
  } else {
    return callback('Error: File type should be image!');
  }
}


let apiResponse = {
    message: 'Authentication Failed!',
    authorization:false,
    status:400,//bad rqst,
    data:{}
  }

module.exports = {
  home:function(req, res, next) {
      res.render('index', {title:'AdDev API',vizochatURL:process.env.VIZOCHAT_BASE_URL})
      
    },
  test:function(req, res, next) {
      let apiRes = JSON.parse(JSON.stringify(apiResponse))
      apiRes.data.user = res.locals.jwtUSER
      apiRes.message = 'Test success!'
      apiRes.status = 'ok'
      apiRes.authorization = true;
      res.json(apiRes)
    }
  ,

  userData:(req,res)=>{
      let apiRes = JSON.parse(JSON.stringify(apiResponse))
      apiRes.data.user = res.locals.jwtUSER
      apiRes.message = 'User fetch success!'
      apiRes.status = 'ok'
      apiRes.authorization = true;
    users.getUser(res.locals.jwtUSER._id).then((data)=>{
      let _data = JSON.parse(JSON.stringify(data))
      delete _data.password
      delete _data.__v
      apiRes.data.userData = _data
      if(data.avatar){
        apiRes.data.userData.avatar = data.avatar;
        apiRes.data.url = process.env.API_URL
      }
    }).catch((er)=>{
      console.log(er);
      apiRes.message = 'Error while fetching data!'
      apiRes.status = 500
    }).then(()=>{
      if(!apiRes.data.userData){
        apiRes.message = 'No account found!'
        apiRes.status = 403
      }
      res.json(apiRes)
    })
  },
  userUpdate:(req,res,next)=>{
    let apiRes = JSON.parse(JSON.stringify(apiResponse))
    apiRes.data.user = res.locals.jwtUSER
    apiRes.message = 'Invalid arguments, please check all input!'
    apiRes.status = 400//bad rqst
    apiRes.authorization = true;
    let dataToUpdate = {
      canUpdate:false,
      data:{}
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      apiRes.message = errors.errors[0].path+((errors.errors[0].msg=="Invalid value")?" is invalid, please check the value!":errors.errors[0].msg)
      // return res.status(200).json(apiRes)
    }
    if(errors.errors.filter(e => e.path === 'email').length <= 0){
      dataToUpdate.canUpdate = true;
      dataToUpdate.data.email = req.body.email;
      console.log(req.body.email);
    }
    if(errors.errors.filter(e => e.path === 'firstName').length <= 0){
      dataToUpdate.canUpdate = true;
      dataToUpdate.data.firstName = req.body.firstName;
    }
    if(errors.errors.filter(e => e.path === 'lastName').length <= 0){
      dataToUpdate.canUpdate = true;
      dataToUpdate.data.lastName = req.body.lastName;
    }
    if(errors.errors.filter(e => e.path === 'phone').length <= 0){
      dataToUpdate.canUpdate = true;
      dataToUpdate.data.phone = req.body.phone;
    }

    if(dataToUpdate.canUpdate){
      users.updateUser(res.locals.jwtUSER._id,dataToUpdate.data).then((data)=>{
        console.log(data);
        apiRes.message = Object.keys(dataToUpdate.data).toString().replace(/,/g,', ')+(Object.keys(dataToUpdate.data).length>1?' are':' is')+' updated successful!'
        apiRes.status = 'ok'
        if(dataToUpdate.data.password)delete dataToUpdate.data.password;
        apiRes.data.updated = {...dataToUpdate.data}
      }).catch((err)=>{
        console.log(err);
        apiRes.message = 'Error while updating profile!'
        if(err.code==11000){
          let exist = Object.keys(err.keyValue)[0]
          apiRes.message = `${exist} is already exist!`
        }
      }).then(()=>{
        res.status(200).json(apiRes)
      })
    }else{
      res.status(200).json(apiRes);
    }
  },
  avatarUpload:(req,res,next)=>{
    let apiRes = JSON.parse(JSON.stringify(apiResponse))
    apiRes.data.user = res.locals.jwtUSER
    apiRes.message = 'Invalid arguments, please check all input!'
    apiRes.status = 400//bad rqst
    apiRes.authorization = true;
    res.locals.upload(req, res, function(err) {
      if (err) {
        apiRes.message = 'File type should be image!'
        res.json(apiRes);
      } else {
        console.log(req.file);
        if (req.file == undefined) {
          apiRes.message = 'Error: No File Selected!'
          res.json(apiRes);
        } else {
          users.updateUser(res.locals.jwtUSER._id,{avatar:req.file.filename}).then(()=>{
            apiRes.message = 'Profile updated successful!'
            apiRes.status = "ok"
            apiRes.data.updated = {avatar:req.file.filename}
          }).catch((err)=>{
            console.log(err);
            apiRes.message = 'Internal error detected while updating profile picture!'
            apiRes.status = 500
          }).then(()=>{
            res.json(apiRes);
          })
        }
      }
    });
  },
  
  
}
 