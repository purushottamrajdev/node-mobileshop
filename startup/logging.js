require('express-async-errors');
const winston=require('winston');
require('winston-mongodb');
 
module.exports=function(){
 
 process.on('uncaughtException',(ex)=>{
 winston.error('Uncaught Exception ',ex);
 process.exit(1);
 });
 
 process.on('unhandledRejection',(ex)=>{
 winston.error('Unhandled Promise ',ex);
 process.exit(1);
 });
 
 winston.add(new winston.transports.File({ filename:'logfile.log'}));
 winston.add(new winston.transports.Console({colorize:true,prettyPrint:true}));
 winston.add(new winston.transports.MongoDB({db:'mongodb+srv://root:root@organicstore-m3qma.mongodb.net/dbMobileShop?retryWrites=true&w=majority',level:'info'}));
}