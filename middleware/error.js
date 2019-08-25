
const winston=require('winston');
module.exports=function(err,req,res,next){
    winston.error(err);//logging error into file
    res.status(500).send('Internal Servar Error');
}
