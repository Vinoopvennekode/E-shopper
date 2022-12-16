const mongoose=require('mongoose')


const walletSchema=mongoose.Schema(
    {
        walletbalence:{
            type:Number,
            required:true
        }

}
)

const wallet=mongoose.model('wallet',walletSchema)

module.exports =wallet
