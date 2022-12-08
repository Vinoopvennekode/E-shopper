const mongoose=require('mongoose')
const { array } = require('../middleware/bannerMulter')

const bannerSchema=mongoose.Schema(
    {
        smallheader:{
            type:String,
            required:true
        },
        imageurl:{
            type:Array,
        },
        title:{
            type:String
        },
        url:{
          type:String
      }

}
)

const banner=mongoose.model('banner',bannerSchema)

module.exports =banner
