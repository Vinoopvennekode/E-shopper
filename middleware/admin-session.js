const adminSession= (req,res,next)=>{
    if(req.session.admin==true){
   next();

    }else{
        res.redirect("/admin/");
    }
}


module.exports={adminSession}