const auth=require('../middleware/auth');
const express=require('express');
const router=express.Router();
const {Mobile,validateMobile}=require('../models/mobile');
const validateObjectId=require('../middleware/validateObjectId');
const isAdmin=require('../middleware/admin');
const isSuperAdmin=require('../middleware/superAdmin');
//api call for creating product
router.post('/',[auth,isAdmin],async(req,res)=>{
    const {error}=validateMobile(req.body);//joi returns error object if error found
    if(error)
        return res.status(400).send(error.details[0].message);
    let mobile=new Mobile({
        company:req.body.company,
        model:req.body.model,
        screenSize:req.body.screenSize,
        price:req.body.price,
        cameraSpecification:req.body.cameraSpecification,
        ram:req.body.ram,
        isDiscountAvailable:req.body.isDiscountAvailable,
        imageUrl:req.body.imageUrl
    })
        mobile=await mobile.save();
        res.status(200).send(mobile);
 });

 //api call for get all product
router.get('/',auth,async(req,res,next)=>{
    //throw new Error('something goes wrong');
    const mobile=await Mobile.find();
    res.status(200).send(mobile);
});

// api call for get singal product
router.get('/:id',[auth,validateObjectId],async(req,res)=>{
    //getProductById(req.params.id)
   
    const mobile=await Mobile.findById(req.params.id);
    if(!mobile)
    return res.status(404).send('Given Id is not present in database');
    return res.status(200).send(mobile);
    
 });

 //api call for update Product
router.put('/:id',[auth,isAdmin,validateObjectId],async(req,res)=>{
    const {error}=validateMobile(req.body);//joi returns error object if error found
    if(error)
        return res.status(400).send(error.details[0].message);
        
            const mobile=await Mobile.findByIdAndUpdate(req.params.id,{
                $set:{
                    company:req.body.company,
                    model:req.body.model,
                    screenSize:req.body.screenSize,
                    price:req.body.price,
                    cameraSpecification:req.body.cameraSpecification,
                    ram:req.body.ram,
                    isDiscountAvailable:req.body.isDiscountAvailable,
                    imageUrl:req.body.imageUrl
                }
            },{new:true}); 
            if(!mobile)
            return res.status(404).send('update unsuccessfull,Given Id is not present in database');
            res.status(200).send(mobile);
        });
//api call for remove Product
router.delete('/:id',[auth,isAdmin,isSuperAdmin,validateObjectId],async(req,res)=>{
    const mobile=await Mobile.findByIdAndRemove(req.params.id);
    if(!mobile)
    return res.status(404).send('delete unsuccessfull,Given Id is not present in database');
    res.status(200).send(mobile);
})


 module.exports = router;