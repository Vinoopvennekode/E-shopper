const mongoose = require('mongoose')
var moment = require('moment');
const review_Schema = new mongoose.Schema(
    { 
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        title: {
            type: String,
        },

        review: {
            type: String,
            required: true
        },

        rating: {
            type: Number
        },
        date: {
            type: String,
            default: moment(Date.now()).format('DD-MM-YYYY')
        }       
    },{ timestamps: true }
)

const review_model = mongoose.model('reviews', review_Schema)
module.exports = review_model






