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
  changeOrderStatus,
  couponBlock,
  couponActive,deletecoupon,
  editCoupon
} = require("../controllers/adminController");


// get method
router.get("/", login);
router.get("/admindash", dash);
router.get("/products", products);
router.get("/add_products", addproducts);
router.get("/logout", logout);
router.get("/users", users);
router.get("/unblock/:id", unblockUser);
router.get("/block/:id", blockUser);
router.get("/categories", category);
router.get('/editcategory/:id',editCategory)
router.get('/deleteCategory/:id',deleteCategory)
router.get('/productDetails/:id',productDetails)
router.get('/banner',banner)
router.get('/add_banner',addbanner)
router.get('/orders',order)
router.get('/orderDetails/:id',orderDeatails)
router.get('/coupon',coupon_view)
router.get('/add-coupon',add_coupon)
router.get('/blockCoupon/:id',couponBlock)
router.get('/active/:id',couponActive)
router.get('/deletecoupon/:id',deletecoupon)
router.get('/editcoupon/:id',editCoupon)


// post methods
router.post("/admin_login", adminLogin);
router.post("/add_products", upload.array("imageurl", 3), add_products);
router.post("/edit", productEditview);
router.post("/editproduct/:id", upload.array("imageurl", 3), editproducts);
router.post("/delete", deleteProduct);
router.post("/addCategory", upload.array("imageurl", 3),addCategory)
router.post('/editCategory/:id', upload.array("imageurl", 3),edit_Category)
router.post('/add_banner',uploadbanner.array("imageurl", 3),addbannerpost)
router.post('/add_cuponpost',add_couponpost)
router.patch('/changeStatus',changeOrderStatus)





module.exports = router;
