module.exports=function(req,res,next){
    if(!req.user.isSuperAdmin)
        return res.status(403).send('Access Denied..');
    next();
}