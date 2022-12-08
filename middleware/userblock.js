const userModel=require('../model/userModel')
    

const userBlock= async(req,res,next)=>{
    if(req.session.user){
        let user = await userModel.findOne({ _id:req.session.user._id})
        if(user.block){
            req.flash('blocking',"user blocked by admin")
           
            res.render('user/login',{blocking: req.flash("blocking")})
            req.session.destroy()
          ;}
        else{
    
            next()
        }}else{
            next();
        }
    }
       
    

 





module.exports={userBlock}