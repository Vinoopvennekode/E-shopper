const { json } = require("body-parser");
const userModel = require("../model/userModel");
const productModel = require("../model/productModel");
const cartModal = require("../model/cartModel");
const addressModel = require("../model/addressModel");
const orderModel = require("../model/orderModel");
const bannerModel = require("../model/bannerModel");
const couponModel = require("../model/couponModel");
const categoryModel = require("../model/categories");
const walletModel = require("../model/walletModel");
const reviewModel=require('../model/reviewModel')
const bcrypt = require("bcrypt");
const moment = require("moment");
const { response } = require("express");
const ObjectId = require("mongodb").ObjectId;
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const {paginatedResults}=require('../utils/pagination')

// import * as paypal from "./paypal_api.js";
const paypal = require("../paypal_api");
// var{paypal}=require('../paypal_api.js')
var {
  validatePaymentVerification,
} = require("../node_modules/razorpay/dist/utils/razorpay-utils");

var instance = new Razorpay({
  key_secret: "Oj25olojN4VL0bc5r1TDq1Qt",
  key_id: "rzp_test_Y6oXi9eOlkktxd",
});

const {
  sendsms,
  verifysms,
  cartCount,
} = require("../otpvalidation/otpvalidation");
const product = require("../model/productModel");
const { resolveInclude } = require("ejs");

const paypal1 = async (req, res) => {
  const order = await paypal.createOrder();
  res.json(order);
};

const paypalorder = async (req, res) => {
  const { orderId } = req.params;
  const captureData = await paypal.capturePayment(orderId);
  res.json(captureData);
};

const userHome = async(req, res) => {
  try {
    console.log("home");
    const userId = req.session.user;
const cartItem=res.cartItem
console.log(cartItem);
    let users = req.session.user;
    await bannerModel.find().then((banner) => {
     productModel.find().then((product) => {
        res.render("user/home", { users, product, banner,cartItem});
      });
    });
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};
const showDetails =async (req, res) => {
  let users = req.session.user;
  console.log(req.params.id);
  const id=req.params.id
  if (users) {
    const userId = req.session.user._id;
    console.log(userId);
    let review = [] = await reviewModel.find({ product: id }).populate("user").sort({ _id: -1 })
    console.log(review);
    const cartItem=res.cartItem
        productModel.findById(req.params.id).then((product) => {
          res.render("user/show-details", {
            users,
            product,
            cartItem,review
          });
        });
   
  } else {
    let review = [] = await reviewModel.find({ product: id }).populate("user").sort({ _id: -1 })

    productModel.findById(req.params.id).then((product) => {
      res.render("user/show-details", { users, product,review });
    });
  }
};

const shop = async (req, res) => {
  try {
    const category = await categoryModel.find();
      const product=res.paginatedResults
      console.log(res.paginatedResults);
    let users = req.session.user;
    const cartItem=res.cartItem
      res.render("user/shop", { users, product, category,pagination:true ,cartItem});
   ;
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const checkout = async (req, res) => {
  let userId = req.session.user._id;
  let cart1 = await cartModal.findOne({ user: userId }).populate( "cartItem.product");
  console.log(cart);
    try {
      console.log(cart1.cartItem[0].product.quantity);
      let check
      let products=[]
      for(i=0;i<cart1.cartItem.length;i++){
        if(cart1.cartItem[i].quantity>cart1.cartItem[i].product.quantity){
        check = true;
        products.push(cart1.cartItem[i].product.title);}
      }

      if(check==true){
        req.flash('empty',products+'  products not available in cart')
        res.redirect('/cart')
      }else{
      console.log(products);
      const cartItem=res.cartItem
      let users = req.session.user;

      let cart = await cartModal
        .findOne({ user: userId })
        .populate("cartItem.product");
      let product = cart.cartItem;
      let subtotal = cart.subtotal;
      let address = await addressModel.findOne({ user: userId });
      let address1;
      if (address) {
        address1 = address.address;
      } else {
        address1 = [];
      }

      let addressnew = await addressModel.aggregate([
        {
          $match: {
            user: mongoose.Types.ObjectId(userId),
          },
        },
        {
          $project: {
            address: {
              $filter: {
                input: "$address",
                cond: {
                  $eq: ["$$this.default", true],
                },
              },
            },
          },
        },
      ]);

      const add = addressnew[0].address;
      let coupon = await couponModel.find();
      console.log(coupon);

      res.render("user/checkout", {
        users,
        address1,
        add,
        product,
        subtotal,
        coupon,
       cartItem
      });}
    } catch (error) {
      console.log(error);
      res.status(404).json({ error });
    }
  
};

const contact = (req, res) => {
  try {
    let users = req.session.user;
    const cartItem=res.cartItem
    res.render("user/contact", { users, cartItem});

  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const userResgister = (req, res) => {
  try {
    const cartItem=res.cartItem
    res.render("user/register",cartItem);
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const loginView = (req, res) => {
  try {
    console.log("loginview");
    res.render("user/login", {
      blocked: req.flash("blocked"),
      passwordErr: req.flash("passwordErr"),
      emailErr: req.flash("emailErr"),
      allFill: req.flash("allFill"),
    });
    console.log("login kazinjuuu");
  } catch (error) {
    res.render("admin/404");
  }
};

// user registration

const userRegisterPost = (req, res) => {
  try {
    const { userName, email, password, mobile, date, block } = req.body;
    req.session.register = req.body;
    req.session.phone = mobile;
    console.log('reqbody');
    console.log('print req.body',req.body);
    sendsms(mobile);
    res.redirect("/otp");
  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: "page not found" });
  }
};

const logout = (req, res) => {
  console.log('logouttttttt');
  req.session.destroy();
  res.redirect("/");
};

const otp = (req, res) => {
  try {
    res.render("user/otpverify", { otperr: req.flash("otperr") });
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const resendotp = (req, res) => {
  const mobile = req.session.phone;
  console.log(mobile);
  sendsms(mobile);
  res.redirect("/otp");
};

// OTP verification
const otpVerify = async (req, res) => {
  try {
    const otp = req.body.otp;
    const phone = req.session.phone;
    const { userName, email, password, mobile, date, block } =
      req.session.register;
    await verifysms(phone, otp).then((verification_check) => {
      if (verification_check.status == "approved") {
        userModel.findOne({ email: email }).then(async (user) => {
          if (!user) {
            let hashPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({
              userName: userName,
              email: email,
              block: block,
              password: hashPassword,
              mobile: mobile,
              date: moment(date).format("MMMM Do YYYY, h:mm:ss a"),
            });
            await newUser.save();
            let user = await userModel.findOne({ email: email });
            console.log("userrrrrrrrrrr" + user);
            const newCart = new cartModal({
              user: user._id,
              cartItem: [],
            });
            newCart.save();
            const newAdd = new addressModel({
              user: user._id,
              address: [],
            });
            newAdd.save();
          }
        });
        res.redirect("/userLogin");
      } else {
        req.flash("otperr", "otp not match");
        console.log("otp failed");
        res.redirect("/otp");
      }
    });
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

// ADD TO CART

const addToCart = async (req, res) => {
  try {
    console.log('carttttttttttttttttttttttttttt');
    const userId = req.session.user._id;
    console.log(userId);
    const proId = req.body.proId;
    let price
    if(req.body.offPrice!=0){
     price=req.body.offPrice
    }else{
     price = req.body.price;}
    console.log(req.body);

    const product = await productModel.findOne({ _id: proId });
    console.log("quaaaaaaaantity" + product.quantity);

    const quantity = await cartModal.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          subtotal: 1,
          cartItem: {
            $filter: {
              input: "$cartItem",
              cond: {
                $eq: ["$$this.product", mongoose.Types.ObjectId(proId)],
              },
            },
          },
        },
      },
    ]);
    
      const user = await cartModal.findOne({ user: userId });

      
      if (!user) {
        if(product.quantity>0){
        const newCart = new cartModal({
          user: userId,
          cartItem: [{ product: proId, total: price }],
          subtotal: price,
        });
        newCart.save();
        res.json({ response: true });
      }else{
        res.json({ response: false });
      }

      } else {
        const cartOld = await cartModal.findOne({
          user: userId,
          "cartItem.product": proId,
        });

        if (cartOld) {
         

          const cartquantity = quantity[0].cartItem[0].quantity;

          if (cartquantity<product.quantity) {
            
            const updateCart = await cartModal.updateOne(
              {
                user: userId,
                "cartItem.product": proId,
              },
              {
                $inc: {
                  "cartItem.$.quantity": 1,
                  "cartItem.$.total": price,
                  subtotal: price,
                },
              }
            );
            let response = {
              stock: true,
            };
            res.json(response);
          }else{
            let response = {
            
              nonstock:true
            };
            res.json(response);
          }
        } else {
          if(product.quantity>0){
          const cartArray = { product: proId, total: price };
          const updateCart = await cartModal.findOneAndUpdate(
            {
              user: userId,
            },
            {
              $push: { cartItem: cartArray },
              $inc: { subtotal: price },
            }
          );
          res.json({ stock: true });
        }else{
          res.json({ nonstock: true });
        }
        }
        
    } 
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

// CART VIEW

const cart = async (req, res) => {
  try {
    let users = req.session.user;
    const userId = req.session.user._id;
    const cartItem=res.cartItem

    const cart = await cartModal
      .findOne({ user: userId })
      .populate("cartItem.product");
   
      res.render("user/cart", { users, cart ,cartItem,empty:req.flash('empty')});     

  } catch (error) {
    console.log(error.message);
    res.status(404).json({ error: "page not found" });
  }
};

// QUANTITY CHANGE

const deletecart = async (req, res) => {
  try {
    console.log(req.body);
    let userId = req.body.userId;
    let proId = req.body.proId;
    console.log(proId);
    let prd = await cartModal.findOne({ product: proId });
    const quantity = await cartModal.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          subtotal: 1,
          cartItem: {
            $filter: {
              input: "$cartItem",
              cond: {
                $eq: ["$$this.product", mongoose.Types.ObjectId(proId)],
              },
            },
          },
        },
      },
    ]);
    console.log("quantity" + quantity);
    const price = quantity[0].cartItem[0].total;
    console.log(price);

    cartModal
      .updateOne(
        { user: userId },
        {
          $pull: { cartItem: { product: proId } },
          $inc: { subtotal: -price },
        }
      )
      .then(() => {
        res.json({ removeProduct: true });
      });
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const incQuantity = async (req, res) => {
  try {
    const productId = req.body.id;
    const userId = req.body.userId;
    const productPrice = req.body.price;
    const quantity1 = req.body.quantity;
    console.log("quantity" + quantity1);

    console.log(req.body);
    const userId1 = req.session.user._id;
    const product = await productModel.findOne({ _id: productId });

    console.log("stock" + product.quantity);
    const stock = product.quantity;
    if (stock-1 >= quantity1) {
      await cartModal.findOneAndUpdate(
        { user: userId, "cartItem.product": productId },
        {
          $inc: {
            "cartItem.$.quantity": 1,
            "cartItem.$.total": productPrice,
            subtotal: productPrice,
          },
        }
      );
    }
    const quantity = await cartModal.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          subtotal: 1,
          cartItem: {
            $filter: {
              input: "$cartItem",
              cond: {
                $eq: ["$$this.product", mongoose.Types.ObjectId(productId)],
              },
            },
          },
        },
      },
    ]);
    const total = quantity[0].cartItem[0].total;
    const subtotal = quantity[0].subtotal;
    const quan = quantity[0].cartItem[0].quantity;
    console.log(total, subtotal, quan);
    if (stock > quan) {
      res.json({
        response: true,
        total: total,
        subtotal: subtotal,
        quantity: quan,
      });
    } else {
      res.json({ stockReached: true });
    }
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ error: "page not found" });
  }
};

const decQuantity = async (req, res) => {
  try {
    const productId = req.body.id;
    const userId = req.body.userId;
    const productPrice = req.body.price;

    console.log(req.body);
    const userId1 = req.session.user._id;

    await cartModal.findOneAndUpdate(
      { user: userId, "cartItem.product": productId },
      {
        $inc: {
          "cartItem.$.quantity": -1,
          "cartItem.$.total": -productPrice,
          subtotal: -productPrice,
        },
      }
    );
    const quantity = await cartModal
      .aggregate([
        {
          $match: {
            user: mongoose.Types.ObjectId(userId),
          },
        },
        {
          $project: {
            subtotal: 1,
            cartItem: {
              $filter: {
                input: "$cartItem",
                cond: {
                  $eq: ["$$this.product", mongoose.Types.ObjectId(productId)],
                },
              },
            },
          },
        },
      ])
      .then((quantity) => {
        const total = quantity[0].cartItem[0].total;
        const subtotal = quantity[0].subtotal;
        const quan = quantity[0].cartItem[0].quantity;
        console.log(total, subtotal, quan);
        res.json({
          response: true,
          total: total,
          subtotal: subtotal,
          quantity: quan,
        });
      });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ error: "page not found" });
  }
};

const userprofile = async (req, res) => {
  try {
    let users = req.session.user;
    let userId = req.session.user._id;
    console.log(userId);
    let address = await addressModel.findOne({ user: userId });
    let address1;
    const cartItem=res.cartItem
    if (address) {
      address1 = address.address;
    } else {
      address1 = [];
    }
    res.render("user/userprofile", { users, address1,cartItem });
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const addAddress = async (req, res) => {
  try {
    const {
      name,
      mobile,
      pincode,
      locality,
      address,
      city,
      landmark,
      state,
      country,
    } = req.body;
    if (
      name &&
      mobile &&
      pincode &&
      locality &&
      address &&
      city &&
      landmark &&
      state &&
      country
    ) {
      console.log(req.body);
      const userId = req.session.user._id;
      const user = await addressModel.findOne({ user: userId });
      if (!user) {
        const newAddress = new addressModel({
          user: userId,
          address: [
            {
              name: name,
              mobileNumber: mobile,
              pinCode: pincode,
              locality: locality,
              address: address,
              cityDistrictTown: city,
              landmark: landmark,
              state: state,
              country: country,
            },
          ],
        });
        newAddress.save();
        res.redirect("/addressBook");
      } else {
        const newaddress = {
          name: name,
          mobileNumber: mobile,
          pinCode: pincode,
          locality: locality,
          address: address,
          cityDistrictTown: city,
          landmark: landmark,
          state: state,
          country: country,
        };
        const addAddress1 = await addressModel.findOneAndUpdate(
          {
            user: userId,
          },
          {
            $push: { address: newaddress },
          }
        );
        res.redirect("/addressBook");
      }
    }
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const editAddress = async (req, res) => {
  try {
    const addressId = req.params.id;

    addressModel
      .updateMany(
        {
          
          "address._id": mongoose.Types.ObjectId(addressId),
        },
        {
          $set: {
            "address.$.name": req.body.name,
            "address.$.pinCode": req.body.pincode,
            "address.$.mobileNumber": req.body.mobile,
            "address.$.locality": req.body.locality,
            "address.$.address": req.body.address,
            "address.$.city": req.body.city,
            "address.$.landmark": req.body.landmark,
            "address.$.state": req.body.state,
            "address.$.country": req.body.country,
          },
        }
      )
      .then(() => {
        res.redirect("/addressBook");
      });
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const deleteAddress = async (req, res) => {
  try {
    console.log(req.params.id);
    const userId = req.session.user._id;
    const addId = req.params.id;
    addressModel
      .updateOne(
        { user: mongoose.Types.ObjectId(userId) },
        {
          $pull: { address: { _id: mongoose.Types.ObjectId(addId) } },
        }
      )
      .then(() => {
        res.redirect("/userprofile");
      });
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const addAddresscheckout = async (req, res) => {
  console.log('jklsdajksdajksdajklsdajklsadjklsajklssajklasdjklsdajklsjklxczjklxzjklxcz');
  try {
    const {
      name,
      mobile,
      pincode,
      locality,
      address,
      city,
      landmark,
      state,
      country,
    } = req.body;
    if (
      name &&
      mobile &&
      pincode &&
      locality &&
      address &&
      city &&
      landmark &&
      state &&
      country
    ) {
      const userId = req.session.user._id;
      const user = await addressModel.findOne({ user: userId });
      if (!user) {
        const newAddress = new addressModel({
          user: userId,
          address: [
            {
              name: name,
              mobileNumber: mobile,
              pinCode: pincode,
              locality: locality,
              address: address,
              cityDistrictTown: city,
              landmark: landmark,
              state: state,
              country: country,
            },
          ],
        });
        newAddress.save();
        res.redirect("/checkout");
        
      } else {
        const newaddress = {
          name: name,
          mobileNumber: mobile,
          pinCode: pincode,
          locality: locality,
          address: address,
          cityDistrictTown: city,
          landmark: landmark,
          state: state,
          country: country,
        };
        const addAddress1 = await addressModel.findOneAndUpdate(
          {
            user: userId,
          },
          {
            $push: { address: newaddress },
          }
        );
        res.redirect("/checkout");
        
      }
    }
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const submitAddress = async (req, res) => {
  console.log(req.query.id);
  let addressId = req.query.id;
  console.log(req.session.user._id);
  let userId = req.session.user._id;
  try {
    await addressModel
      .findOneAndUpdate(
        { user: userId, "address.default": true },
        { $set: { "address.$.default": false } }
      )
      

     await addressModel
      .findOneAndUpdate(
        { user: userId, "address._id": addressId },
        { $set: { "address.$.default": true } }
      )
      console.log('haiiii');
    res.redirect('/checkout')
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const searchproduct = async (req, res) => {
  try {
    console.log(req.body.product);
    let users = req.session.user;
    const product = await productModel.find({
      $or: [
        {
          title: { $regex: req.body.product, $options: "i" },
        },
      ],
    });
    res.render("user/shop", { users, product });
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const postcheckout = async (req, res) => {
  try {
    console.log(req.body);
    // console.log("userId" + req.session.user._id);
    const userId = req.session.user._id;
    console.log(req.body.paymentMethod);
    const { date } = req.body;

    const couponName = req.body.couponCode;
    let coupon = await couponModel.findOne({ code: couponName });
 

    let addressnew = await addressModel.aggregate([
      {
        $match: {
          user: mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          address: {
            $filter: {
              input: "$address",
              cond: {
                $eq: ["$$this.default", true],
              },
            },
          },
        },
      },
    ]);
    const add = addressnew[0].address;
    if (add == 0) {
      {
        console.log("choose payment method");
        let response = { message1: "must choose your address" };
        res.json(response);
      }
    } else {
      // console.log("addressssssss" + add);

      let cart = await cartModal.findOne({ user: userId });
      // console.log("cart" + cart);

      const products = cart.cartItem;
      const total = req.body.total;
      // const address = await addressModel.findById(add[0]);
      if (req.body.paymentMethod === "cash on delivery") {
        const paymentMethod = req.body.paymentMethod;

        const newOrder = new orderModel({
          user: userId,
          products: products,
          total: total,
          address: add,
          paymentMethod,
          paymentStatus: "payment pending",
          track: "order confirmed",
          orderStatus: "order confirmed",
          date: moment(date).format("MMMM Do YYYY, h:mm:ss a"),
        });
        newOrder.save().then(async (result) => {
          req.session.orderId = result._id;
          // console.log("result id" + result._id);
          // console.log("result" + result);
          const order = await orderModel.findOne({ _id: result._id });
          // console.log("order" + order);
          const findproId = order.products;
          findproId.forEach(async (el) => {
            console.log("element" + el);
            let removeQuantity = await productModel.findOneAndUpdate(
              { _id: el.product },
              { $inc: { quantity: -el.quantity } }
            );
          });
          // console.log("result" + result);
          if (coupon) {
            await couponModel.findOneAndUpdate(
              { _id: coupon._id },
              { $inc: { couponCount: -1 } }
            );
          }
          await cartModal.findOneAndRemove({ user: result.user._id });

          const newCart = new cartModal({
            user: req.session.user._id,
            cartItem: [],
          });
          newCart.save();

          res.json({ cashOnDelivery: true });
        });
      } else if (req.body.paymentMethod === "razorpay") {
        const userId = req.session.user._id;
        const products = cart.cartItem;
        const total = req.body.total;
        const paymentMethod = req.body.paymentMethod;
        const add = addressnew[0].address;
        const newOrder = new orderModel({
          user: userId,
          products: products,
          total: total,
          address: add,
          paymentMethod,
          paymentStatus: "payment pending",
          track: "order confirmed",
          orderStatus: "order confirmed",
          date: moment(date).format("MMMM Do YYYY, h:mm:ss a"),
        });
        newOrder.save().then((result) => {
          let userOrderData = result;
        
          const orderId1=result.id
          if(coupon){
            var couponId=coupon._id}
          id = result._id.toString();
          instance.orders.create(
            {
              amount: result.total * 100,
              currency: "INR",
              receipt: id,
            },
            (err, order) => {
              let response = {
                razorpay: true,
                orderdata: order,
                orderId:orderId1,
                couponId:couponId,
                userOrderData: userOrderData,
              };
              res.json(response);
            }
          );
        });
      } else if (req.body.paymentMethod === "paypal") {
        let response = { paypal };
        res.json(response);
        
      } else if (req.body.paymentMethod === "wallet") {
        const user = await userModel.findOne({ _id: userId });
        console.log(user.walletBalance);
        const walletBalance = user.walletBalance;
        console.log(total);
        if(!walletBalance){
          console.log('wallet balance zero');
          let response = { message2: "wallet balance is zero" };
        res.json(response);
        }
        else if (walletBalance < total) {
          const balancePayment = total - walletBalance;
          console.log(balancePayment);
          console.log(userId, products, total, add);
          const newOrder = new orderModel({
            user: userId,
            products: products,
            total: total,
            address: add,
            paymentMethod: "through wallet",
            paymentStatus: "payment pending",
            track: "order confirmed",
            orderStatus: "order confirmed",
            date: moment(date).format("MMMM Do YYYY, h:mm:ss a"),
          });
          newOrder.save().then(async(result) => { 
            console.log(result);
            console.log(result._id);
            let userOrderData = result;
            req.session.orderId = result._id;
            const orderId1=result.id
           if(coupon){
            var couponId=coupon._id}

            id = result._id.toString();
            instance.orders.create(
              {
                amount: balancePayment * 100,
                currency: "INR",
                receipt: id,
              },
              (err, order) => {
                let response = {
                  razorpay: true,
                  ordertotal: walletBalance,
                  orderId:orderId1,
                  couponId:couponId,
                  orderdata: order,
                  userOrderData: userOrderData,
                };
                res.json(response);
              }
            );
          });
        } else {
          const newOrder = new orderModel({
            user: userId,
            products: products,
            total: total,
            address: add,
            paymentMethod: "through wallet",
            paymentStatus: "payment done",
            track: "order confirmed",
            orderStatus: "order confirmed",
            date: moment(date).format("MMMM Do YYYY, h:mm:ss a"),
          });
          newOrder.save().then(async (result) => {
            console.log("result id" + result._id);
            console.log("result" + result);
            const order = await orderModel.findOne({ _id: result._id });
            console.log("order" + order);
            const findproId = order.products;
            findproId.forEach(async (el) => {
              console.log("element" + el);
              let removeQuantity = await productModel.findOneAndUpdate(
                { _id: el.product },
                { $inc: { quantity: -el.quantity } }
              );
            });
            console.log("result" + result);
            const totalamount=walletBalance-total
            console.log(totalamount);
            await userModel.findOneAndUpdate(
              {_id:req.session.user._id},
              {$inc:{
                walletBalance: -total},$push:{walletHistory:{history:'Rs.'+total+' Debited on '+moment(Date.now()).format('DD-MM-YYYY')+' (orderId-'+result._id+')'}}}
            )
            console.log(result._id);
            await orderModel.findByIdAndUpdate(
              { _id:  result._id},
              { $set: { deductwallet: total } }
            );

            if (coupon) { 
              await couponModel.findOneAndUpdate(
                { _id: coupon._id },
                { $inc: { couponCount: -1 } }
              );
            }
            await cartModal.findOneAndRemove({ user: result.user._id });

            const newCart = new cartModal({
              user: req.session.user._id,
              cartItem: [],
            });
            newCart.save();

            res.json({ wallet: true });
          });
        }
      } else {
        console.log("choose payment method");
        let response = { message: "must choose your payment method" };
        res.json(response);
      }
    }
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const postVerifyPayment = async (req, res) => {
  try {
    // console.log("post verify payment");

    console.log(req.body.orderId);
    let razorpayOrderDataId = req.body["razorpayOrderData[razorpay_order_id]"];

    let paymentId = req.body["razorpayOrderData[razorpay_payment_id]"];

    let paymentSignature = req.body["razorpayOrderData[razorpay_signature]"];

    let userOrderDataId = req.body["userOrderData[_id]"];

    validate = validatePaymentVerification(
      { order_id: razorpayOrderDataId, payment_id: paymentId },
      paymentSignature,
      "Oj25olojN4VL0bc5r1TDq1Qt"
    );

    if (validate) {

      if(req.body.ordertotal){
console.log('validateeeeeeeee');
      await orderModel.findByIdAndUpdate(
        { _id:  req.body.orderId},
        { $set: { deductwallet: req.body.ordertotal } }
      );

      await userModel.findOneAndUpdate(
        {_id:req.session.user._id},
        {$inc:{
          walletBalance: -req.body.ordertotal}}
      )}
console.log('orderrrrrrrrrr');
      const order = await orderModel.findOne({ _id: req.body.orderId });

      const findproId = order.products;
      findproId.forEach(async (el) => {
        let removeQuantity = await productModel.findOneAndUpdate(
          { _id: el.product },
          { $inc: { quantity: -el.quantity } }
        );
      });
      const couponId =req.body.couponId;  
      console.log(',jghsadkjsdghalhgsakjsdga'+couponId);
      const coupon = await couponModel.findOne({ _id: couponId });

      if (coupon) {
        await couponModel.findOneAndUpdate(
          { _id: couponId },
          { $inc: { couponCount: -1 } }
        );
      }

   


      await cartModal.findOneAndRemove({ user: req.session.user._id });
      const newCart = new cartModal({
        user: req.session.user._id,
        cartItem: [],
      });
      newCart.save();

      orderModel
        .findOneAndUpdate(
          { _id: userOrderDataId },
          {
            $set: {
              orderStatus: "Order Placed",
              paymentStatus: "Payment Completed",
            },
          }
        )
        .then((result) => {
          res.json({ status: true });
        });
    } else {
      console.log("not valid");
    }
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const paymentfailed = (req, res) => {
  try {
    res.json({ status: true });
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};
 
const myWallet = async (req, res) => {
  let users = req.session.user; 
  let userId = req.session.user._id;
  const cartItem=res.cartItem
  const user = await userModel.findOne({ _id: userId });
  console.log(user);
   const walletAmount = user.walletBalance;
  const walletHistory=user.walletHistory
  const length=user.walletHistory.length
  console.log(walletHistory);

  res.render("user/wallet", { users, walletHistory,length,walletAmount,cartItem});
};

const myOrders = async (req, res) => {
  try {
    let users = req.session.user;
    let userId = req.session.user._id;
    const cartItem=res.cartItem
    const order = await orderModel
      .find({ user: userId })
      .populate("user")
      .sort({ date: -1 })
      .then((order) => {
        // console.log(order);
        res.render("user/myOrders", { users, order,cartItem });
      });
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const myOrderDetails = (req, res) => {
  try {
    let users = req.session.user;
    const cartItem=res.cartItem
    const order = orderModel
      .findById(req.params.id)
      .populate("products.product")
      .then((order) => {
        res.render("user/Myorderdetails", { order, users,cartItem });
      });
  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const applycoupon = async (req, res) => {
  console.log(req.body);
  let couponmsg;
  let grandtotal;
  let total = req.body.total;
  let code = req.body.couponCode;
  req.session.couponCode = code;
  let result = await couponModel.findOne({ code: code, status: "ACTIVE" });
  console.log("result" + result);
  let nowDate = Date.now();
  if (!result) {
    couponmsg = "coupon does not exist";
    res.json({ status: false, couponmsg });
  } else {
    let cuponType = result.couponType;
    let cutOff = parseInt(result.cutOff);
    let maxRedeemAmount = parseInt(result.maxRedeemAmount);
    let minCartAmount = parseInt(result.minCartAmount);
    let couponCount = parseInt(result.couponCount);
    let date = result.expireDate;

    console.log(cuponType, cutOff, maxRedeemAmount, couponCount, date, nowDate);
    if (couponCount != 0) {
      if (nowDate < date) {
        if (cuponType == "Percentage") {
          if (total < minCartAmount) {
            couponmsg = "minimum Rs " + minCartAmount + " for this product";
            res.json({ status: false, couponmsg });
          } else {
            let reduceAmount = Math.round((total * cutOff) / 100);
            if (reduceAmount > maxRedeemAmount) {
              let grandtotal = Math.round(total - maxRedeemAmount);
              let response = {
                status: true,
                grandtotal: grandtotal,
                cutOff: maxRedeemAmount,
                couponmsg,
              };
              res.json(response);
            } else {
              grandtotal = Math.round(total - reduceAmount);
              let response = {
                status: true,
                grandtotal: grandtotal,
                cutOff: reduceAmount,
                couponmsg,
              };
              res.json(response);
            }
          }
        } else if (cuponType == "Amount") {
          if (total < minCartAmount) {
            let couponmsg = "minimum Rs" + minCartAmount + "for this product";
            res.json({ status: false, couponmsg });
          } else {
            grandtotal = Math.round(total - cutOff);

            let response = {
              status: true,
              grandtotal: grandtotal,
              cutOff: cutOff,
            };
            res.json(response);
          }
        }
      } else {
        couponmsg = "coupon date expired";
        res.json({
          status: false,
          couponmsg,
        });
      }
    } else {
      couponmsg = "coupon limit exceeded";
      res.json({
        status: false,
        couponmsg,
      });
    }
  }
};

const cancleOrder = async (req, res) => {
  console.log(req.params.id);

  const orderId = req.params.id;
  await orderModel.findByIdAndUpdate(orderId, {
    $set: { orderStatus: "Cancelled" },
  });
  res.redirect(`/myOrderDetails/${req.params.id}`);
};

const paymentRefund = async (req, res) => {
  console.log(req.params.id);
  const userId = req.session.user._id;
  console.log(userId);
  const orderId = req.params.id;
  const order = await orderModel.findOne({ _id: orderId });
  console.log(order.total);
  const totalPrice = order.total;

  const refund = await userModel.findOneAndUpdate(
    { _id: userId },
    { $inc: { walletBalance: totalPrice },$push:{walletHistory:{history:'Rs.'+totalPrice+' Credited on '+moment(Date.now()).format('DD-MM-YYYY')+' (orderId-'+orderId+')'}} }
    
  );
  console.log(refund);

  await orderModel.findByIdAndUpdate(orderId, {
    $set: { paymentStatus: "payment Refunded" },
  });

  res.redirect(`/myOrderDetails/${req.params.id}`);
};

const productReturn = async (req, res) => {
  try {
    const orderId = req.params.id;
    await orderModel.findByIdAndUpdate(orderId, {
      $set: { orderStatus: "Returned" },
    });
    res.redirect(`/myOrderDetails/${req.params.id}`);
  }  catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const categoryFilter = async (req, res) => {
  try {
    let tags = req.query.tags;
    let filterkey = tags.split(",");
    console.log(filterkey);

    await productModel
      .find({ category: { $in: [filterkey] } })
      .populate("category")
      .then((products) => {
        let response = {
          products: products,
        };
        res.json(response);
      });
  }  catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const categoryAll = async (req, res) => {
  try {
    productModel.find().then((result) => {
      res.json(result);
    });
  } catch (err) {
    console.log(err);
  }
};

const postLogin = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    if (email && password) {
      let user = await userModel.findOne({ email: email });
      if (user) {
        const compare = await bcrypt.compare(password, user.password);
        console.log(compare);
        if (compare) {
          if (user.block == false) {
            req.session.userlogin = true;
            req.session.user = user;
            res.redirect("/");
            console.log("login succeded");
          } else {
            console.log("userblock");
            req.flash("blocked", "you are blocked");
            res.redirect("/userLogin");
          }
        } else {
          console.log("password err");
          req.flash("passwordErr", "your password is incorrect");
          res.redirect("/userLogin");
        }
      } else {
        console.log("email err");
        req.flash("emailErr", "invalid User");
        res.redirect("/userLogin");
      }
    } else {
      console.log("allFill");
      req.flash("allFill", "fill all input");
      res.redirect("/userLogin");
    }
  }  catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const userLogin = (req, res) => {
  res.render("user/userlogin", {
    blocked: req.flash("blocked"),
    passwordErr: req.flash("passwordErr"),
    emailErr: req.flash("emailErr"),
    allFill: req.flash("allFill"),
  });
};

const cartlenth = async (req, res) => {
  const item = await cartModal
    .findOne({ user: userId })
    .populate("cartItem.product");
  console.log("leeeeeeenght");
  console.log(item);
};

const categorySelect = async (req, res) => {
  try {
    console.log("categryyyyyy               " + req.params.id);
    const catId = req.params.id;

    let users = req.session.user;
    const product = await productModel.find({ category: catId });
    console.log("product                    " + product);
    const category = await categoryModel.find();
    console.log("category              " + category);
    res.render("user/shop", { users, product, category });
  }  catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const addressBook=async(req,res)=>{
  try{
     const users=req.session.user
     const userId=req.session.user._id
     const cartItem=res.cartItem
     let address = await addressModel.findOne({ user: userId });
     let address1;
     if (address) {
       address1 = address.address;
     } else {
       address1 = [];}
res.render('user/addressBook',{users,address1,cartItem})

  } catch (error) {
    res.status(404).json({ error: "page not found" });
  }

}





  const review=async(req,res)=>{
    console.log('sdasasdasaaasdsda');
    console.log(req.body);
    try {
      let userId = req.session.user._id
      let { rating, review, id, title } = req.body

      rating = rating * 20
      const reviews = {}
      reviews.rating = rating
      reviews.product = id
      reviews.user = userId
      reviews.review = review
      reviews.title = title
      const currentrat=rating
      console.log(currentrat);

      reviewModel.findOneAndReplace({ product: id, user: userId }, reviews).then(async rev => {
        console.log(rev);
          if (rev) {
              let rat = {} = await productModel.findById(id, { _id: 0, rating: 1, review: 1 })
              console.log(rat);
              // rating = (rat.rating + currentrat - rev.rating) / rat.review
              rating=((rat.rating*rat.review)-rev.rating+currentrat)/rat.review
              
              console.log(rat.rating+'   '+currentrat+'   '+rev.rating+'   '+rat.review);
              console.log(rating);
              await productModel.findByIdAndUpdate(id, { $set: { rating: rating } })
              res.json()
          }
          else {
              reviewModel.create(reviews).then(async () => {
                
                  await productModel.findByIdAndUpdate(id, { $inc: { review: 1, rating: rating } })
                  res.json()
              }).catch(error => next(error))
          }
      }).catch(error => next(error))

  }  catch (error) {
    res.status(404).json({ error: "page not found" });
  }
  }


  const catFilter=async(req,res)=>{
    try {
      console.log(req.body);
      const catId=req.body.id

    const product = await productModel.find({ category: catId });

console.log(product);
res.json({status:true,product})

    }  catch (error) {
      res.status(404).json({ error: "page not found" });
    }
  }



module.exports = {
  userHome,
  showDetails,
  cart,
  shop,
  checkout,
  postcheckout,
  postVerifyPayment,
  paymentfailed,
  contact,

  loginView,
  userResgister,
  userRegisterPost,
  logout,
  otp,
  resendotp,
  otpVerify,
  addToCart,
  deletecart,
  incQuantity,
  decQuantity,
  userprofile,
  addAddress,
  categorySelect,
  addAddresscheckout,
  submitAddress,
  editAddress,
  deleteAddress,
  searchproduct,
  myOrders,
  myWallet,
  myOrderDetails,
  applycoupon,
  paypal1,
  paypalorder,
  cancleOrder,
  paymentRefund,
  productReturn,
  categoryFilter,
  categoryAll,
  cartlenth,
  postLogin,
  userLogin,
  addressBook,review,
  catFilter
};
