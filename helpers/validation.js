let { check, validationResult } = require('express-validator');
let bcrypt = require('bcrypt')



  module.exports = {
    signupValidate : [
      check('firstName').isLength({ min: 4 }).withMessage("is invalid, must contain minimum of 4 letters").trim(),
      check('lastName').isLength({ min: 1 }).withMessage("is invalid, must provide a last name").trim(),
      check('email').isEmail().normalizeEmail().withMessage("is invalid, must be a valid one!").trim(),
      check('password').isLength({ min: 8 }).withMessage('must be at least 8 chars long').trim()
    ],
    userUpdateValidate : [
      check('firstName').isLength({ min: 4 }).trim().withMessage(" is invalid, must contain minimum of 4 letters"),
      check('LastName').isLength({ min: 3 }).trim().withMessage(" is invalid, must contain minimum of 3 letters"),
      check('email').isEmail().withMessage(" is invalid, must be a valid format!").trim(), //.normalizeEmail() removed due to it removes . from email for no reason!
      check('phone').isLength({ min: 10 }).withMessage(' must be a valid 10 digit number!').trim(),
    ],
    loginValidate : [
      check('email').isLength({ min: 4 }).withMessage(' is not valid!').trim(),
      check('password').isLength({ min: 8 }).withMessage(' is not valid!').trim()
    ],
    
    validateEmail : (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    },
    hashPassword:  (plaintextPassword)=>{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(plaintextPassword, salt);
        return hash
           
    },
    hashPasswordvalidate : async (plaintextPassword, hash)=> {
        const result = await bcrypt.compare(plaintextPassword, hash)
        return result;
    },
    
  }