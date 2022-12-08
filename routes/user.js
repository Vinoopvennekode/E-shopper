const express = require("express");
const router = express.Router();
const {
  userHome,
  showDetails,
  cart,
  shop,
  checkout,
  contact,
  userLogin,
  userResgister,
  userRegisterPost,
  userSign,
  authUser,
  logout,
  otpVerify,
  otp,
  resendotp,
  addToCart,
  deletecart,incQuantity,decQuantity,userprofile,addAddress,submitAddress,postcheckout,postVerifyPayment,paymentfailed,addAddresscheckout,deleteAddress,editAddress,searchproduct,
  myOrders,myOrderDetails
} = require("../controllers/userController");



const {userSession,noSession}= require("../middleware/session");

const {userBlock}= require("../middleware/userblock");
// get methods

router.get("/",userHome);
router.get("/details/:id",showDetails);
router.get("/cart",userBlock,cart);
router.get("/shop",shop);
router.get("/checkout",userBlock, userSession,checkout);
router.get("/contact", contact);
router.get("/login",noSession,userLogin);



//user registration
router.get("/register", userResgister);



// user registraion post method
router.post("/add-to-cart",userBlock,userSession,addToCart);
router.get("/signin", userSign);
router.get("/logout", logout);
router.get("/otp", otp);
router.get('/resendotp',resendotp)
router.get('/userprofile',userBlock,userSession,userprofile)
router.get('/submitAddress',userBlock,userSession,submitAddress)
router.get('/deleteaddress/:id',userBlock,userSession,deleteAddress)
router.get("/myorders",userBlock,userSession,myOrders)
router.get('/myOrderDetails/:id',userBlock,userSession,myOrderDetails)







// post methods
router.post("/otpverify", otpVerify);
router.post("/register", userRegisterPost);
router.post("/login", authUser);
router.post('/add_address',userSession,addAddress)
router.post('/edit_address/:id',userSession,editAddress)
router.post('/add_addresscheckout',addAddresscheckout)
router.post('/searchproduct',searchproduct)
router.post('/checkout',userBlock,userSession,postcheckout)
router.post('/verifyPayment',  postVerifyPayment)
router.post('/paymentFailed',paymentfailed)



router.patch("/quantityInc",incQuantity)
router.patch("/quantityDec",decQuantity)




router.delete('/deletecart',deletecart)


module.exports = router;
