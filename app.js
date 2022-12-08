const express=require('express');
const dotenv=require('dotenv')
const axios=require('axios')
const connectDB=require('./config/DB')
const bcrypt=require('bcrypt')
const path =require('path')
// var logger = require('morgan');
const session=require('express-session')
const flash=require('connect-flash')

const bodyParser=require('body-parser')
const expressLayouts=require('express-ejs-layouts');


dotenv.config()
const app=express()
connectDB()
const userRouter=require('./routes/user')
const adminRouter=require('./routes/admin')
// app.use(logger('dev'));
app.use(flash())
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(session({secret:"ttt",resave: true,saveUninitialized:true,cookie:{maxAge:600000}}))
app.use((req,res,next)=>{
  res.set("cache-control","no-cache,private,max-age=0,no-store,must revalidate,max-stale=0,post-check=0,pre-check=0"
  );
  next();
});
//user static files

app.use(express.static(path.join(__dirname,'public')))
app.use('/css',express.static(__dirname+'/public/user/css'))
app.use('/img',express.static(__dirname+'/public/user/img'))
app.use('/js',express.static(__dirname+'/public/user/js'))
app.use('/lib',express.static(__dirname+'/public/user/lib'))
app.use('/mail',express.static(__dirname+'/public/user/mail'))
app.use('/scss',express.static(__dirname+'/public/user/scss'))

//admin static files
app.use('/assets',express.static(__dirname+'/public/admin/assets'))




//seting view engine
app.use(expressLayouts)
app.set('views',__dirname+'/views')
app.set('layout','./layout/layout')
app.set('view engine','ejs')


//navigation
app.use('/',userRouter)
app.use('/admin',adminRouter)

app.use(function(req,res){res.status(404).render('admin/404')})

app.listen(process.env.PORT,console.log(`port is running on ${process.env.PORT}`))