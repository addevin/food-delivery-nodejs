let { check, validationResult } = require('express-validator');
const jwt = require('../helpers/jwt');
const { hashPassword } = require('../helpers/validation');
const { addUser, getUser, validateUser, validateUserWithEmail } = require('../model/users')

module.exports= {
  signup: (req,res,next)=>{
      let response = {
          message: 'Something went wrong!',
          status:401,
          data:{}
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        response.message = errors.errors[0].path+" "+((errors.errors[0].msg=="Invalid value")?"is invalid, please check the value!":errors.errors[0].msg);
        return res.status(200).json(response);
      }
      addUser({
          firstName: req.body.firstName.replace(/[ ]+/g,'_'), 
          lastName: req.body.lastName,
          email: req.body.email,
          password: hashPassword(req.body.password),
    }).then(async (data)=>{
      let token = jwt.sign({
        _id:data._id,
        firstName:data.firstName

      })
      response.data = token;
      response.message = 'Account Created Successful!'
      response.status = 'ok';
    }).catch((err)=>{
      response.message = 'Authentication error!'
      if(err.code==11000){
          let exist = Object.keys(err.keyValue)[0]
          response.message = `${exist} is already exist!`
      }
      console.log(err);
    }).then(()=>{
      res.json(response)
    })
    
  },
  login:async (req,res,next)=>{
    let response = {
      message: 'Authentication Failed!',
      status:401,
      data:{}
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      response.message = (errors.errors[0].msg=="Invalid value")?errors.errors[0].path+" is invalid, please check the value!":errors.errors[0].msg
      return res.status(200).json(response)
    }
    let uData = await validateUser(req.body); //false or userdata
    if(uData){
      let token = jwt.sign({
        _id:uData._id,
        firstName:uData.firstName,
      })
      response.data = token;
      response.message = 'Login Successful!'
      response.status = 'ok';
      return res.json(response)
    }else{
      return res.status(200).json(response)
    }
  },
  
  tokenGen:(req,res,next)=>{
    let response = {
      message: 'Authentication Failed!',
      status:401,
      authorization:false,
      data:{}
    }
    const newToken = jwt.generateAccessTkn(req)
    if(newToken.error){
      return res.status(200).json(response)
    }else{
      response.message = 'Access Token Generated Successful!'
      response.status = 'ok';
      response.data = newToken.data;
      response.authorization = true;
      return res.json(response)
    }
  },
 
}