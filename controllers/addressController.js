const userModel = require("../model/userModel");
const addressModel=require('../model/addressModel')
const productModel = require("../model/productModel");




const addAddress=(req,res)=>{
    try{

const{name,mobileNumber,pincode,locality,address,city,state,landmark}=req.body
let userId=req.body.user._id
const newAddress=new addressModel({
     user:userId,
     address:[{name:name,mobileNumber:mobileNumber,pincode:pincode,locality:locality,address:address,cityDistrictTown:city,state:state,landmark:landmark}]
});
newAddress.save()



    }
    catch{}
}