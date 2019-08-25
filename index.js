const express=require('express');
const app=express();

require('./startup/logging')();//handle errors
require('./startup/db')();//db configaration

require('./startup/routes')(app);//routing
require('./startup/config')();//error configaration
require('./startup/mob')(app);

const port=process.env.PORT||3000;
const server=app.listen(port,()=>console.log(`Listening on port ${port}`));

module.exports=server;

