const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const uploadbanner=require('../middleware/bannerMulter')

const {
  login,
  dash,
  products,
  addproducts,
  adminLogin,
  deleteProduct,
  add_products,
  productEditview,
  productDetails,
  editproducts,
  logout,
  category,
  users,
  blockUser,
  unblockUser,
  addCategory,
  editCategory,
  edit_Category,deleteCategory,banner,addbanner,addbannerpost,order,orderDeatails,
  coupon_view,add_coupon,
  add_couponpost,
  editCouponpost,
  changeOrderStatus,
  couponBlock,
  couponActive,deletecoupon,
  editCoupon,totalOrder,categorySale,
  salesReport,
  totalSales,
  salesreport,
  vinoop
} = require("../controllers/adminController");
const { adminSession} = require("../middleware/admin-session");


// get method
router.get("/", login);
router.get("/admindash",adminSession, dash);
router.get("/products",adminSession, products);
router.get("/add_products",adminSession, addproducts);
router.get("/logout", logout);
router.get("/users",adminSession, users);
router.get("/unblock/:id",  adminSession,unblockUser);
router.get("/block/:id",adminSession, blockUser);
router.get("/categories",adminSession, category);
router.get('/editcategory/:id',adminSession,editCategory)
router.get('/deleteCategory/:id',adminSession,deleteCategory)
router.get('/productDetails/:id',adminSession,productDetails)
router.get('/banner',adminSession,banner)
router.get('/add_banner',adminSession,addbanner)
router.get('/orders',adminSession,order)
router.get('/orderDetails/:id',adminSession,orderDeatails)
router.get('/coupon',adminSession,coupon_view)
router.get('/add-coupon',adminSession,add_coupon)
router.get('/blockCoupon/:id',adminSession,couponBlock)
router.get('/active/:id',adminSession,couponActive)
router.get('/deletecoupon/:id',adminSession,deletecoupon)
router.get('/editcoupon/:id',adminSession,editCoupon),
router.post('/totalOrder',adminSession,totalOrder)
router.get('/categorySale',adminSession,categorySale)
router.get('/salesReport',adminSession,salesReport)

router.get('/totalSales',totalSales)


// post methods
router.post("/admin_login",adminLogin);
router.post("/add_products", upload.array("imageurl", 3),adminSession, add_products);
router.post("/edit",adminSession, productEditview);
router.post("/editproduct/:id", upload.array("imageurl", 3), adminSession,editproducts);
router.post("/delete", adminSession,deleteProduct);
router.post("/addCategory", upload.array("imageurl", 3),adminSession,addCategory)
router.post('/editCategory/:id', upload.array("imageurl", 3),adminSession,edit_Category)
router.post('/add_banner',uploadbanner.array("imageurl", 3),adminSession,addbannerpost)
router.post('/add_cuponpost',adminSession,add_couponpost)
router.post('/edit_cuponpost/:id',adminSession,editCouponpost)
router.patch('/changeStatus',adminSession,changeOrderStatus)
router.patch('/salesreport',salesreport)





module.exports = router;
