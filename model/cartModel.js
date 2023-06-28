const mongoose = require("mongoose");
const user = require("./userModel");

const cartSchema = mongoose.Schema(
  {
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    cartItem: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product", 
          // required:true
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
        total: {
          type: Number,
        },
      },
    ],
    subtotal: {
      type: Number,
    },
  },
  { timestamps: true }
);

const cart = mongoose.model("cart", cartSchema);

module.exports = cart;
