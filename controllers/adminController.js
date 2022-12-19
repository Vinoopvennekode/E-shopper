const productModel = require("../model/productModel");
const userModel = require("../model/userModel");
const categoryModel=require('../model/categories')
const bannerModel=require('../model/bannerModel')
const orderModel=require('../model/orderModel')
const couponModel=require('../model/couponModel')
const moment = require("moment");
const upload = require("../middleware/multer");
const { response } = require("express");

const userNameDB = "vinoop@1";
const passwordDB = "111";


//  ADMIN AUTHENTICATION
const adminLogin = (req, res) => {
  try {
    const { userName, password } = req.body;
    if (userName === userNameDB && password === passwordDB) {
      req.session.admin=true
      console.log(req.session.admin);
      res.redirect("/admin/admindash");
    }else{
      console.log("input err");
      req.flash("inputErr", "Username or password incorrect");
      res.redirect("/admin/");
    }
  } catch (error) {
    res.status(400)
    console.log(error.message);
  }
};





// ADMIN LOGIN
const login = (req, res) => {
  try{
res.render("admin/login", { layout: "./layout/adminLayout" , inputErr: req.flash("inputErr"),});
}catch(error){
  res.status(400).json({error:'page not found'})
}
}
  

const dash =async (req, res) => {
  try{
    let sales = 0;
    let online = 0;
    let offline = 0;
    let transaction = 0;
    let monthSalesCount = 0;
    const totalSales = await orderModel.aggregate([{$match:{orderStatus:"Delivered"}},
       
    {
      $group: {
        _id: null,
         totalPrice: { $sum: "$total" },
      
      },
    },
  ])
    if (totalSales.length > 0) {
      sales = totalSales[0].totalPrice;
    }
    const transactions = await orderModel.aggregate([
      {
        $group: {
          _id: null,
          price: { $sum: "$total" },
        },
      },
    ]);
    if (totalSales.length > 0) {
       transaction=transactions[0].price;
    }

    
      
      

    let newDate =  moment().format("MMMM Do YYYY") 
    const totalUsers = await userModel.find({}).count();
    const blockedUser = await userModel.find({ is_active: false }).count();
    const totalorders = await orderModel.find({}).count();
    const todayorders = await orderModel.find({date:newDate}).count()

    res.render("admin/dashboard", { layout: "./layout/adminLayout",sales,transaction,totalUsers,blockedUser,totalorders,todayorders}); 
    

  }catch(error){
    res.status(400).json({error:'page not found'})

  }
  }




// ADD PRODUCTS
const add_products = async (req, res) => {
    
  try {
    const {
      title,
      price,
      size,
      color,
      quantity,
      offerPercentage,
      date,
      category,
      brand,
      description,
    } = req.body;
    let offerPrice
    if(title&&price&&size&&color&&quantity&&offerPercentage&&category&&brand&&description){


      //offer checking......................................................................


      if(offerPercentage!=0){
        const catOffer= await categoryModel.findById(category,{_id:0,offerPrecentage:1})
        const catOfferPercentage=catOffer.offerPrecentage
        const catOfferPrice=Math.round(price-(price*catOfferPercentage)/100)
        const proOfferPrice=Math.round(price-(price*offerPercentage)/100)
        console.log(proOfferPrice,catOfferPercentage,catOfferPrice);
        if(proOfferPrice<catOfferPrice){
           offerPrice=proOfferPrice
        }else{
          offerPrice=catOfferPrice
        }
        
        
      }
    console.log(req.body);
    const newProduct = new productModel({
      title: title,
      category: category,
      price: price,
      offerPrice:offerPrice,
      size: size,
      brand: brand,
      color: color,
      offerPercentage:offerPercentage,
      quantity: quantity,
      date: moment(date).format("MMMM Do YYYY, h:mm:ss a"),
      description: description,
      imageurl: req.files,
    });
    // Object.assign(req.body,{imageurl:req.file.filename})
    await newProduct.save();
    res.redirect("/admin/add_products");}
  }catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};




// PRODUCT VIEW
const products = (req, res) => {
  try{
    console.log(req.session.admin);
  productModel
    .find().populate("category").sort({date:-1})
    .then((product) => {
      res.render("admin/products", { layout: "./layout/adminLayout", product });
    
;})
    
    .catch((err) => {
      console.log(err);
    });
  }catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};




// ADD PRODUCTS VIEW
const addproducts = (req, res) => {
  try{ categoryModel.find().then((category)=>{
    res.render("admin/add_products", { layout: "./layout/adminLayout",category });  
  })}catch(error){
    res.status(400).json({error:'page not found'})

  }
 
  
};


const productDetails=(req,res)=>{
  console.log(req.params.id);
  try{

    productModel
    .findById(req.params.id).populate('category')
    .then((product) => {
      res.render("admin/productdetails", { layout: "./layout/adminLayout", product });
    })

  }
  catch(error){
    res.status(400).json({error:'page not found'})

  }
}





// PRODUCT EDIT VIEW
const productEditview = async(req, res) => {
  try{
    const category = await categoryModel.find()
  productModel
    .findById(req.body.id)
    .then((product) => {
      res.render("admin/editproducts", { layout: "./layout/adminLayout", product,category });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({error:'page not found'})
    });
  }catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};





// 
const editproducts =async (req, res) => {
  console.log('ouyrtoiuweoiuwyoiuweyoiuyoiuwetyoiuywtoiuywtuiowywiiy');
  try{const {
    title,
    price,
    size,
    color,
    quantity,
    offerPercentage,
    date,
    category,
    brand,
    description,
  } = req.body;
  let offerPrice
   
  console.log(req.params.id);
  console.log(req.body);

  // const img = req.files;
  // if (img.length) req.body.imageurl = img;

console.log('first');       
    const catOffer= await categoryModel.findById(category,{_id:0,offerPrecentage:1})
    console.log(catOffer);
    const catOfferPercentage=catOffer.offerPrecentage
    console.log(catOfferPercentage);
    const catOfferPrice=Math.round(price-(price*catOfferPercentage)/100)
    console.log(catOfferPrice);
    const proOfferPrice=Math.round(price-(price*offerPercentage)/100)
    console.log(proOfferPrice)
    console.log('asdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsdsd');
    console.log(proOfferPrice,catOfferPercentage,catOfferPrice);
    if(proOfferPrice<catOfferPrice){
       offerPrice=proOfferPrice
    }else{
      offerPrice=catOfferPrice
    }
    
    
  
console.log(catOfferPercentage,catOfferPrice,proOfferPrice);
  productModel.findByIdAndUpdate(req.params.id,{title: title,
    category: category,
    price: price,
    price:price,
    size: size,
    brand: brand,
    color: color,
    offerPercentage:offerPercentage,
    offerPrice:offerPrice,
    quantity: quantity,
    date: moment(date).format("MMMM Do YYYY, h:mm:ss a"),
    description: description,
    imageurl: req.files,}).then(() => {
    res.redirect("/admin/products");
  });
}catch (error) {
  res.status(404).json({ error: "page not found" });
}
};

const deleteProduct = (req, res) => {
  try{
  console.log(req.body.id);
  productModel
    .findByIdAndDelete(req.body.id)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
  }catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const logout = (req, res) => {
  try{
  req.session.destroy();
  res.redirect("/admin");
}catch (error) {
  res.status(404).json({ error: "page not found" });
}
};

const users = (req, res) => {
  try {
    userModel.find().sort({date:-1}).then((user) => {
      res.render("admin/clients", { layout: "./layout/adminLayout", user });
    });
  }catch (error) {
    res.status(404).json({ error: "page not found" });
  }
};

const unblockUser = (req, res) => {
  try{
  console.log(req.params.id);
  let userid = req.params.id;
  userModel.findByIdAndUpdate(userid, { block: false }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/admin/users");
    }
  });
}catch (error) {
  res.status(404).json({ error: "page not found" });
}
};
const blockUser = (req, res) => {
  try{
  console.log(req.params.id);
  let userid = req.params.id;
  userModel.findByIdAndUpdate(userid, { block: true }, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/admin/users");
    }
  });
}catch (error) {
  res.status(404).json({ error: "page not found" });
}
};

const category = (req, res) => {
  try{
  categoryModel.find().then((category)=>{
    res.render("admin/categories", { layout: "./layout/adminLayout",category  ,cateExist: req.flash("cateExist"),cateExist1: req.flash("cateExist1")});
  }).catch((error)=>{
    console.log(error);
  })
}catch (error) {
  res.status(404).json({ error: "page not found" });
}
};

const addCategory = async(req, res) => {

        try{
          const{name,discription,offerPercentage}=req.body
          const imageurl=req.files
          console.log(req.body);
          let regEx=new RegExp(name,'i')
          if(name&&discription&&imageurl){
            const category= await categoryModel.findOne({name:{$regex:regEx}})
console.log(category);
            if(!category){
              const newcategory=new categoryModel({
                name:name,
                discription:discription,
                offerPrecentage:offerPercentage,
                imageurl:req.files
              })
              await newcategory.save();
              res.redirect('/admin/categories')
              console.log('category');
            }else{
              req.flash('cateExist',"category already exist")
              res.redirect('/admin/categories')
              console.log('already exist');
            } }
        }
        catch(error){
          console.log(error);
          res.status(400).json({error:'page not found'})

        }
  };

const editCategory=(req,res)=>{
  
  try{
    categoryModel.findById(req.params.id)
    .then((category)=>{
      res.render('admin/editCategory',{ layout: "./layout/adminLayout",category })
    })
  }catch(error){
    res.status(400).json({error:'page not found'})

  }
}



const edit_Category = async(req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  const img = req.files;
  if (img) req.body.imageurl = img;
try{
  const catId=req.params.id
const{name,discription,offerPercentage}=req.body
  await categoryModel.findByIdAndUpdate(req.params.id,{name:name,
    discription:discription,
    offerPrecentage:offerPercentage,
    imageurl:req.files})

    await productModel.updateMany({category:catId,offerPercentage:{$lt:offerPercentage}},
      [{"$set":{"offerPrice":{$round:[{$sum:[{$divide:[{$multiply:["$price",-offerPercentage]},100]},"$price"]},0]}}}])
    
    
      res.redirect('/admin/categories')
  
  }catch(error){
    console.log(error);
    res.status(400).json({error:'page not found'})

  }
};

  const deleteCategory = async (req, res) => {
    try {
      const ID = req.params.id;
      console.log(ID);
      productModel.findOne({ category: ID }).then((categoryIs) => {
        console.log(categoryIs);
        if (!categoryIs) {
          categoryModel.findByIdAndDelete(ID).then(() => {
            res.redirect("/admin/categories");
          });
        }else{
          req.flash('cateExist1',"product exist in category,you cant't delete")
          res.redirect("/admin/categories")
          

        }
      });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({error:'page not found'})

}
  };










  const banner=(req,res)=>{
    try{

bannerModel.find().then((banner)=>{
  res.render('admin/bannerDetails',{banner})
})

}catch (error) {
  res.status(404).json({ error: "page not found" });
}
  
  }


  const addbanner=(req,res)=>{
    try{
    res.render('admin/addBanner')
  }catch (error) {
    res.status(404).json({ error: "page not found" });
  }
  }


  const addbannerpost=async(req,res)=>{
    
  console.log('banner');
    console.log(req.body);  
    console.log(req.files);
 

    try{
const{ title1,title,url}=req.body
      if(title1&&title&&url){
        const newbanner=new bannerModel({
          smallheader:title1,
          title:title,
          url:url,
          imageurl: req.files
        
        })
        await newbanner.save()
        res.redirect('/admin/banner')
      }
    }catch (error) {
      res.status(404).json({ error: "page not found" });
    }
  }




  const order=async(req,res)=>{
    try{
const order= orderModel.find().populate('user').sort({date:-1}).then((order)=>{
  console.log(order);
  res.render('admin/order',{order})
})
}catch (error) {
  res.status(404).json({ error: "page not found" });
}
  }



  const orderDeatails=(req,res)=>{
const orderId=req.params.id

    try{
      const order= orderModel.findById(req.params.id).populate('products.product').then((order)=>{
        res.render('admin/orderDetails',{order})
      })


    }catch (error) {
      res.status(404).json({ error: "page not found" });
    }
  }



  const coupon_view=async(req,res)=>{
    await couponModel.find().sort({date:-1}).then((coupon)=>{
      res.render('admin/coupon_view',{coupon,couponExist: req.flash("couponExist")})
    })
   
  }
  


  const add_coupon=(req,res)=>{
    res.render('admin/add_coupon')
  }





  const add_couponpost=async(req,res)=>{
    const{code,CouponType,cutOff,minCartAmount,maxRedeem,couponCount,expirydate,description}=req.body

try{
  if(code&&CouponType&&cutOff&&minCartAmount&&maxRedeem&&couponCount&&expirydate&&description){
    console.log('coopppnn');
    console.log(req.body); 
  

    let Code = code.toUpperCase();
    await couponModel.find({code:Code}).then(async(result)=>{
      if(result.length==0){
        const coupon=new couponModel({
          code:Code,
          cutOff:cutOff,
          couponType:CouponType,
          maxRedeemAmount:maxRedeem,
          minCartAmount:minCartAmount,
          couponCount:couponCount,
          expireDate:expirydate,
          description:description
        })
        coupon.save();
        res.redirect('/admin/coupon')
      }else{
        req.flash('couponExist',"coupon already exist")
        res.redirect('/admin/coupon')
      }
    })

  }else{
    console.log('enter all input');
    
  }
}catch{}

  }

  const couponActive=async(req,res)=>{
    console.log('active');
    console.log(req.params.id);
    await couponModel.findByIdAndUpdate(req.params.id,{$set:{status:'ACTIVE'}})
    res.redirect('/admin/coupon')

  }
  const couponBlock=async(req,res)=>{
    console.log('block');
    console.log(req.params.id);
    await couponModel.findByIdAndUpdate(req.params.id,{$set:{status:'BLOCK'}})
    res.redirect('/admin/coupon')

  }

const editCouponpost=async(req,res)=>{

  try{
  console.log(req.params.id);
  console.log(req.body);

  await couponModel.findByIdAndUpdate(req.params.id,req.body).then(()=>{
    res.redirect('/admin/coupon')
  })
}catch{}
}

const deletecoupon= async(req,res)=>{
  try{
    await couponModel.findByIdAndDelete(req.params.id)
    res.redirect('/admin/coupon')
  }catch{}
}


const editCoupon=async(req,res)=>{
  try{
    console.log(req.params.id);
    const id=req.params.id
   await couponModel.findOne({_id:id}).then((coupon)=>{
    res.render('admin/editCoupon',{coupon})
   })
   
  }catch{}
}

  const changeOrderStatus=async(req,res)=>{
    
    const orderId=req.body.id
    const value=req.body.value
console.log(orderId,value);
   await orderModel.findByIdAndUpdate(orderId,{$set:{orderStatus:value}})

res.json({update:true})
  }




const totalOrder=async (req,res)=>{
  console.log('total order');
  const data = await orderModel.aggregate([
    { $group: { _id: { $month: "$time" }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  // console.log('data'+data)
  let counts = [];

    data.forEach((ele) => {
      counts.push(ele.count);
    });
    res.json({ status: true, counts });
 
}



const categorySale=async(req,res)=>{
 
  try{
    console.log('categorySale');
    let data = await orderModel
    .aggregate([{$match:{status:"Delivered"}},
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product.category",
          totalPrice: { $sum: "$products.total" },
          count: { $sum: "$products.quantity" },
        },
      },
    ])
    .sort({ count: -1 });


    let counts=[11, 16, 7, 3, 14]
    res.json({ status: true, counts });

  }catch{}




}


const   salesReport=async(req,res)=>{
  try{

    let data = await orderModel
      .aggregate([{$match:{orderStatus:"Delivered"}},
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.product",
            // name:"$products.$product.title",
            totalPrice: { $sum: "$products.total" },
            count: { $sum: "$products.quantity" },
          },
        },
      ])
      .sort({ count: -1 });

    console.log(data);


    res.render('admin/salesReport',{data})
  }catch{}
}



module.exports = {
    
    
  login,
  addCategory,
  dash,
  products,
  addproducts,
  adminLogin,
  add_products,
  productEditview,
  deleteProduct,
  logout,
  category,
  users,
  editproducts,
  productDetails,
  unblockUser,
  blockUser,
  editCategory,edit_Category,
  deleteCategory,
  banner,addbanner,
  addbannerpost,order,orderDeatails,
  coupon_view,
  add_coupon,
  add_couponpost,
  editCouponpost,changeOrderStatus,
  couponBlock,
  couponActive,
  deletecoupon,
  editCoupon,
  totalOrder,
  categorySale,
  salesReport
  

  
}
