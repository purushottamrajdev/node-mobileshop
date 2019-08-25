const mongoose=require('mongoose');
const Joi=require('joi');

//Schema
const mobileSchema=new mongoose.Schema({
    company:{type:String,
        required:true,
        minlength:3,
        maxlength:20
    },
    model:{
        type:String,
        required:true,
        minlength:3,
        maxlength:30
    },
    screenSize:{
        type:Number,
        required:true,
        min:3,
        max:20
    },
   price:{
       type:Number,
       required:true,
       min:500,
       max:100000
   },
   cameraSpecification:{
       type:String,
       required:true,
       minlength:3,
       maxlength:50,
   },
   ram:{
       type:Number,
       required:true,
       min:1,
       max:500
   },
   isDiscountAvailable:{
       type:Boolean,
       required:true
   },
   imageUrl:{
       type:String,
       required:true,
       minlength:5,
       maxlength:500
   }
});

//Model for schema
const Mobile=mongoose.model('Mobile',mobileSchema);
function validateMobile(mobile)
{
    const schema={
        company:Joi.string().min(3).max(20).required(),
        model:Joi.string().min(3).max(30).required(),
        screenSize:Joi.number().min(3).max(20).required(),
        price:Joi.number().min(500).max(100000).required(),
        cameraSpecification:Joi.string().min(3).max(50).required(),
        ram:Joi.number().min(1).max(500).required(), 
        isDiscountAvailable:Joi.required(),
        imageUrl:Joi.string().min(5).max(500).required().uri()  
    }
    return Joi.validate(mobile,schema); 
}

exports.Mobile=Mobile;
exports.validateMobile=validateMobile;