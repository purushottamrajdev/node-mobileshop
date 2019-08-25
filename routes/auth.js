const Joi=require('joi');
const express=require('express');
const router=express.Router();
const {User}=require('../models/user');
const bcrypt=require('bcrypt');

router.post('/',async(req,res)=>{
    const {error}= validate(req.body);
    if(error)
        return res.status(400).send(error.details[0].message);
    const user= await User.findOne({email:req.body.email});
    if(!user)
        return res.status(401).send('Invalid Username or Password');
    const validPassword=await bcrypt.compare(req.body.password,user.password);
    if(!validPassword)
     return res.status(400).send('Invalid Password');
     const token=user.generateAuthToken();
     res.status(400).send(token);
})

function validate(req){
    const schema={
        email:Joi.string().min(5).max(255).required().email(),
        password:Joi.string().min(5).max(1024).required()
    }
    return Joi.validate(req,schema);
}

module.exports=router;