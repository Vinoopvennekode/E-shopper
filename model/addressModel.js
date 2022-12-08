const mongoose=require('mongoose')

const userAddressSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    address:[ {name:{
        type:String,
        
    },
    mobileNumber:{
        type:String,
        
    },
    pinCode:{
        type:String,
        
    },
    locality:{
        type:String,
        
    },
    address:{
        type:String,
        
    },
    cityDistrictTown:{
        type:String,
        
    },
    state:{
        type:String,
        
    },
    landmark:{
        type:String,
        
    },country:{
        type:String
    },
    default:{
        type:Boolean,
        default:false
    }}]

})


const userAddress=mongoose.model('userAddress',userAddressSchema)

module.exports =userAddress
