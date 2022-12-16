const express = require("express");
const router = express.Router();
const {
  userHome,
  showDetails,
  cart,
  shop,
  checkout,
  contact,
  // userLogin,
  loginView,
  userResgister,
  userRegisterPost,
  logout,
  otpVerify,
  otp,
  resendotp,
  addToCart,
  deletecart,
  incQuantity,
  decQuantity,
  userprofile,
  addAddress,
  categorySelect,
  submitAddress,
  postcheckout,
  postVerifyPayment,
  paymentfailed,
  addAddresscheckout,
  deleteAddress,
  editAddress,
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



  postLogin,userLogin
} = require("../controllers/userController");

const { userSession, noSession } = require("../middleware/session");

const { userBlock } = require("../middleware/userblock");
const { route } = require("./admin");
// get methods

router.get("/details/:id", showDetails);
router.get("/cart", userBlock, userSession, cart);
router.get("/shop", shop);
router.get("/checkout", userBlock, userSession, checkout);
router.get("/contact", contact);
// router.get("/login",noSession,userLogin);

//user registration
router.get("/register", userResgister);

router.get("/loginview", loginView);

router.get("/", userHome);

// user registraion post method
router.post("/add-to-cart", userBlock, userSession, addToCart);
// router.get("/signin", userSign);
router.get("/logout", logout);
router.get("/otp", otp);
router.get("/resendotp", resendotp);
router.get('/categorySelect/:id',categorySelect)
router.get("/userprofile", userBlock, userSession, userprofile);
router.get("/submitAddress", userBlock, userSession, submitAddress);
router.get("/deleteaddress/:id", userBlock, userSession, deleteAddress);
router.get("/myorders", userBlock, userSession, myOrders);
router.get('/myWallet',myWallet)
router.get("/myOrderDetails/:id", userBlock, userSession, myOrderDetails);
router.get("/categoryFilter", categoryFilter);
router.get('/refund/:id',paymentRefund)
router.get('/productReturn/:id',productReturn)

router.get('/cartlength',cartlenth)

router.post("/CategoryAll", categoryAll);

// post methods


router.post("/otpverify", otpVerify);
router.post("/register", userRegisterPost);

router.post("/add_address", userSession, addAddress);
router.post("/edit_address/:id", userSession, editAddress);
router.post("/add_addresscheckout", addAddresscheckout);
router.post("/searchproduct", searchproduct);
router.post("/checkout", userBlock, userSession, postcheckout);
router.post("/verifyPayment", postVerifyPayment);
router.post("/paymentFailed", paymentfailed);
router.post("/applycoupon", applycoupon);
router.post("/api/orders", paypal1);
router.post("/api/orders/:orderId/capture", paypalorder);
router.get("/cancelOrder/:id", cancleOrder);


router.patch("/quantityInc", incQuantity);
router.patch("/quantityDec", decQuantity);

router.delete("/deletecart", deletecart);





router.post('/postLogin',postLogin)
router.get('/userLogin',userLogin)


module.exports = router;
