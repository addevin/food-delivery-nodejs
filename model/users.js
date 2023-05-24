const mongoose = require('mongoose');
const { validateEmail, hashPasswordvalidate } = require('../helpers/validation');
const slug = require('slug')

const userSchema = new mongoose.Schema(
    {   
        firstName: {type:String, required:true, index: true},
        lastName: {type:String, required:true, index: true},
        email: {type:String, required: true, unique:true, index: true},
        password: {type:String, required: true},
        phone: {type:String},
        avatar: {type:String},
        login_ses:  {type:String},
        joined:   {type:Date, default: Date.now()},
        last_login: {type:Date, default: Date.now},
        
    }
    // ,{timestamps:true}
)

let users = module.exports = mongoose.model("users", userSchema)

module.exports.getUser =  function(id){
    return users.findById(id)
}

module.exports.getUsersCount =  function(data){
    return users.countDocuments(data)
}

module.exports.addUser = function (data){
    let uNew = new users(data)
    return uNew.save()
}
module.exports.updateUser = function (id,data){
    if(data.username){
        data.username = slug(data.username,'_')
    }
    return users.updateOne({_id:id},{$set:data})
}

module.exports.validateUser = async function(reqBody){
    try {
        let data = {};
        if(validateEmail(reqBody.email)){
            data.email = reqBody.email
        }else{
            return false
        }
        let uData = await users.findOne(data);
        if(uData){
            if(await hashPasswordvalidate(reqBody.password, uData.password)){
                return uData;
            }else{
                return false
            }
        }else{
            return false;
        }
    } catch (error) {
        console.log(error);
        return false
    }
}
module.exports.validateUserWithEmail = async function(email){
    try {
        let data = {};
        if(validateEmail(email)){
            data.email = email
        }else{
            return false;
        }
        let uData = await users.findOne(data);
        if(uData){
            return uData;
        }else{
            return false;
        }
    } catch (error) {
        console.log(error);
        return false
    }
}
module.exports.getAll = ()=>{
    return users.find({})
}
