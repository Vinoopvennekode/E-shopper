const mongoose=require('mongoose')

const categorySchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        imageurl:{
            type:Array,
        },
        discription:{
            type:String
        },
        offerPrecentage:{
            type:Number
        },

},{ timestamps: true }
)

const category=mongoose.model('category',categorySchema)

module.exports =category
