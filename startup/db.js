const mongoose =require('mongoose');
const config=require('config');
const db=config.get('db');
module.exports=function(){mongoose.connect(db,{useNewUrlParser:true})//connection string
.then(()=>{
        console.log(`connected to mongodb ${db}`);
});
//.catch((err)=>("Cloud not connect to mongoDb..",err));
}