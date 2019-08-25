const jwt=require('jsonwebtoken');
const config=require('config');//for gate jwtPrivateKey,set in environment variable

module.exports=function(req,res,next){
   const token=req.header('x-auth-token')
    if(!token)
        return res.status(401).send('Access Denied...No Token Provided');
    try{
        const decoded=jwt.verify(token,config.get('jwtPrivateKey'));//extract payload from token
        req.user=decoded;//passed payload to request pipeline
        next();
    }
     catch(err){
        res.status(400).send('Invalid Token');
    }  
}