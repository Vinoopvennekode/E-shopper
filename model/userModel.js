const mongoose=require('mongoose')

const userSchema =mongoose.Schema(
    { 
        userName:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
        },
        mobile:{
            type:String,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        date:{
            type:String,
            Default: Date.now
        },
        block:{
            type:Boolean,
            default:false
            
        },
        address:[ {name:{
            type:String,
            required:true
        },
        mobileNumber:{
            type:String,
            required:true
        },
        pinCode:{
            type:String,
            required:true
        },
        locality:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },
        cityDistrictTown:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        landmark:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        }
    }]
    
        
    }
)

const user=mongoose.model('user',userSchema)

module.exports =user