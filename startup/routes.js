const express=require('express');
const mobile=require('../routes/mobile');
const user=require('../routes/user');
const auth=require('../routes/auth');
const error=require('../middleware/error');
module.exports=function(app){
app.use(express.json());//middleware
app.use('/api/mobile',mobile);
app.use('/api/user',user);
app.use('/api/auth',auth);
app.use(error)
}