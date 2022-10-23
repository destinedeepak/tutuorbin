var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')

var userSchema = new Schema({
    username:{type: String, required: true, unique:true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
})

userSchema.pre('save', async function(next){
  console.log(this,"users this")
    if(this.password && this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
        next()
    }else{
        next();
    }
})

userSchema.methods.verifyPassword = async function(password){
    try {
        let result = bcrypt.compare(password, this.password);
        return result;
    } catch (error) {
        return error;
    }
}

userSchema.methods.signToken =async function(){
    var payload = {userId: this.id, email: this.email};
    try {
        let token = await jwt.sign(payload, process.env.JWTSECRET);
        return token;
    } catch (error) {
        return error;
    }
}

userSchema.methods.userJSON = function(token){
    return{
        username: this.username,
        email: this.email,
        token: token
    }
}

module.exports = mongoose.model('User', userSchema);