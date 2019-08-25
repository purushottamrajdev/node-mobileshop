const auth=require('../middleware/auth');
const express=require('express');
const router=express.Router();
const {User,validateUser}=require('../models/user');
const _=require('lodash');
const bcrypt=require('bcrypt');




router.get('/me/:id',auth,async(req,res,next)=>{
   const user=await User.findById(req.params.id).select('-password');
   if(!user)
    return res.status(401).send('User not present in database with given id');
    res.status(200).send(user); 
})
//api call for registering new user
router.post('/',async(req,res)=>{
    const {error}=validateUser(req.body);//joi returns error object if error found
    if(error)
       return  res.status(400).send(error.details[0].message);
    let user= await User.findOne({email:req.body.email});//checking user all ready present or not in database
    if(user)
       return  res.status(400).send('User all ready registered');
    user=new User(_.pick(req.body,['name','email','password']));
    const salt= await bcrypt.genSalt(10);//
    user.password= await bcrypt.hash(user.password,salt);

    await user.save();
    const token=user.generateAuthToken();
    res.header('x-auth-token',token).status(200).send(_.pick(user,['_id','name','email']));
})

module.exports=router;