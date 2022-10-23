var express = require('express');
var User = require('../models/users');

var router = express.Router();

/* REGISTER users */
router.post('/', async (req, res, next) => {
  const { email } = req.body;
   try{
    let user = await User.findOne({email});
    if(user) return res.json({
      user: await user.userJSON( await user.signToken()),
      message: "User already exists",
    });
    user = await User.create(req.body);
    res.json({
      user: await user.userJSON( await user.signToken()),
    })
   }catch(error){
     next(error);
   }
});

// LOGIN users 
router.get('/login', async (req, res, next) => {
  var {email, password} = req.body;
  if(!email || !password) return res.status(400).json({error: "Email/Password required!"});
  try {
    let user = await User.findOne({email});
    if(!user) return res.status(400).json({error: "Email is not registered"});
    let result = await user.verifyPassword(password);
    if(!result) return res.status(400).json({error: "Password is invalid"});
    let token = await user.signToken();
    res.json({user: await user.userJSON(token)})
  } catch (error) {
    next(error);
  }
})

module.exports = router;
