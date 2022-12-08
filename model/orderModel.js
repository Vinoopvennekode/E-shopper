const mongoose=require('mongoose')

const orderSchema=mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
          },
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
          },
          products: [{
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                // required:true
            },
            quantity:{
                type:Number,
                default:1,
                min:1,
            },
            total:{
                type:Number
            }
          }

          ],
          total: {
            type: Number,
            required: true,
          },
          address: {
            type:Array
           ,
          },
          paymentMethod: {
            type: String,
            required: true,
          },
          paymentStatus: {
            type: String,
            required: true,
          },
          orderStatus: {
            type: String,
            required: true,
          },
          track:{
            type: String,
          },
        //   returnreason:{
        //     trpe:String,
        //   }
    }
)


const order=mongoose.model('order',orderSchema)

module.exports =order
