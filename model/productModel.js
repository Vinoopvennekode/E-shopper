const mongoose=require('mongoose')
const { array } = require('../middleware/multer')


const productSchema =mongoose.Schema(
    { 
        title:{
            type:String,
            
        },
        price:{
            type:Number,
            
        }, 
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"category",  
            
        },
        brand:{
            type:String,
            
        },
        size:{
            type:String,
            
        },
        color:{
            type:String,
            
        },
        quantity:{
            type:Number,
            // required:true,
        }, 
        offerPercentage:{
            type:Number
        } ,
        offerPrice:{
            type:Number
        },
        date:{
            type:String,
            Default: Date.now
        },
        description:{
            type:String,
            // required:true,
        },
        imageurl:{
            type:Array,
        }
    },{ timestamps: true }
      
)

   

const product=mongoose.model('product',productSchema)

module.exports =product